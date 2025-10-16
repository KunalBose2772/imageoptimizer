import formidable from 'formidable';
import sharp from 'sharp';
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

  try {
    // Parse the form data
    const form = formidable({
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: ({ mimetype }) => {
        // Only allow WEBP files
        return mimetype && mimetype.includes('image/webp');
      },
    });

    const [fields, files] = await form.parse(req);
    
    if (!files.file || !files.file[0]) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = files.file[0];

    // Generate output filename
    const originalName = uploadedFile.originalFilename || 'converted';
    const baseName = path.parse(originalName).name;
    const outputFilename = `${baseName}_converted.png`;
    const outputPath = path.join('./public/uploads', outputFilename);

    // Convert WEBP to PNG using Sharp (lossless conversion)
    await sharp(uploadedFile.filepath)
      .png({
        compressionLevel: 6, // Balance between file size and compression speed
        progressive: true, // Enable progressive PNG
        quality: 100 // Maximum quality for lossless conversion
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
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.setHeader('Content-Length', convertedBuffer.length);

    // Send the converted file
    res.status(200).send(convertedBuffer);

  } catch (error) {
    console.error('Conversion error:', error);
    
    // Clean up any temporary files on error
    try {
      if (files?.file?.[0]?.filepath && fs.existsSync(files.file[0].filepath)) {
        fs.unlinkSync(files.file[0].filepath);
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

