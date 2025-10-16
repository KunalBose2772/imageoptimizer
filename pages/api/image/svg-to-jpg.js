import formidable from 'formidable';
import sharp from 'sharp';
import svg2img from 'svg2img';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  console.log('SVG to JPG conversion request received');
  
  try {
    // Parse the form data
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: ({ mimetype }) => {
        // Only allow SVG files
        return mimetype && (mimetype.includes('image/svg+xml') || mimetype.includes('image/svg'));
      },
    });

    const [fields, files] = await form.parse(req);
    
    if (!files.file || !files.file[0]) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = files.file[0];
    const quality = parseInt(fields.quality?.[0] || '90');

    // Validate quality parameter
    if (quality < 10 || quality > 100) {
      return res.status(400).json({ error: 'Quality must be between 10 and 100' });
    }

    // Generate output filename
    const originalName = uploadedFile.originalFilename || 'converted';
    const baseName = path.parse(originalName).name;
    const outputFilename = `${baseName}_converted.jpg`;
    const outputPath = path.join(process.cwd(), 'public', 'uploads', outputFilename);

    // Read SVG file
    const svgContent = fs.readFileSync(uploadedFile.filepath, 'utf8');
    
    // Convert SVG to PNG using svg2img
    const pngBuffer = await new Promise((resolve, reject) => {
      svg2img(svgContent, {
        width: 2048,
        height: 2048,
        preserveAspectRatio: true
      }, (error, buffer) => {
        if (error) reject(error);
        else resolve(buffer);
      });
    });
    
    // Convert PNG to JPG using Sharp
    await sharp(pngBuffer)
      .jpeg({ 
        quality: quality,
        mozjpeg: true, // Use mozjpeg encoder for better compression
        progressive: true // Enable progressive JPEG
      })
      .toFile(outputPath);

    // Read the converted file
    const convertedBuffer = fs.readFileSync(outputPath);

    // Clean up temporary files with error handling
    try {
      if (fs.existsSync(uploadedFile.filepath)) {
        fs.unlinkSync(uploadedFile.filepath);
      }
    } catch (cleanupError) {
      console.warn('Could not delete uploaded file:', cleanupError.message);
    }
    
    try {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    } catch (cleanupError) {
      console.warn('Could not delete output file:', cleanupError.message);
    }

    // Set response headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.setHeader('Content-Length', convertedBuffer.length);

    // Send the converted file
    res.status(200).send(convertedBuffer);

  } catch (error) {
    console.error('Conversion error:', error);
    
    // Clean up any temporary files on error
    try {
      if (req.files?.file?.[0]?.filepath && fs.existsSync(req.files.file[0].filepath)) {
        fs.unlinkSync(req.files.file[0].filepath);
      }
    } catch (cleanupError) {
      console.warn('Cleanup error:', cleanupError.message);
    }

    res.status(500).json({ 
      error: 'Conversion failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
