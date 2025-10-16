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
        // Only allow HEIF and HEIC files
        return mimetype && (mimetype.includes('image/heif') || mimetype.includes('image/heic'));
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
    const outputPath = path.join('./public/uploads', outputFilename);

    try {
      // Convert HEIF to JPG using Sharp
      await sharp(uploadedFile.filepath)
        .jpeg({ 
          quality: quality,
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);

      // Read the converted file
      const convertedBuffer = fs.readFileSync(outputPath);

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
      res.setHeader('Content-Length', convertedBuffer.length);

      // Send the converted file
      res.send(convertedBuffer);

    } catch (conversionError) {
      console.error('Conversion error:', conversionError);
      return res.status(500).json({ error: 'Conversion failed. Please try again.' });
    } finally {
      // Clean up files with robust error handling
      try {
        if (fs.existsSync(uploadedFile.filepath)) {
          fs.unlinkSync(uploadedFile.filepath);
        }
      } catch (unlinkError) {
        console.error('Could not delete uploaded file:', unlinkError.message);
      }
      
      try {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (unlinkError) {
        console.error('Could not delete converted file:', unlinkError.message);
      }
    }

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
