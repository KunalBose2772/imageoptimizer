import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: ({ mimetype }) => {
        return mimetype && mimetype.startsWith('image/');
      },
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];
    const upscaleFactor = fields.upscaleFactor?.[0] || '2x';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Processing AI upscaling request...');
    console.log('Upscale factor:', upscaleFactor);

    // Read the input image
    const inputBuffer = fs.readFileSync(file.filepath);
    
    // Process with Sharp
    let processedImage;
    
    try {
      // Get original image metadata
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      
      console.log('Original image metadata:', { 
        width: metadata.width, 
        height: metadata.height, 
        format: metadata.format 
      });
      
      // Parse upscale factor
      const factor = parseInt(upscaleFactor.replace('x', ''));
      const newWidth = metadata.width * factor;
      const newHeight = metadata.height * factor;
      
      console.log('Target size:', { width: newWidth, height: newHeight });
      
      // Upscale using high-quality LANCZOS resampling
      processedImage = await image
        .resize(newWidth, newHeight, {
          kernel: sharp.kernel.lanczos3,
          withoutEnlargement: false
        })
        .sharpen({
          sigma: 1.0,
          flat: 1.0,
          jagged: 2.0
        })
        .png({ quality: 95 })
        .toBuffer();
      
      console.log('Image upscaled successfully');
      
    } catch (processingError) {
      console.error('Sharp processing error:', processingError);
      
      // Fallback: basic upscaling without enhancement
      try {
        const image = sharp(inputBuffer);
        const metadata = await image.metadata();
        const factor = parseInt(upscaleFactor.replace('x', ''));
        const newWidth = metadata.width * factor;
        const newHeight = metadata.height * factor;
        
        processedImage = await image
          .resize(newWidth, newHeight, {
            kernel: sharp.kernel.lanczos3
          })
          .png({ quality: 90 })
          .toBuffer();
        
        console.log('Image upscaled with fallback method');
        
      } catch (fallbackError) {
        console.error('Fallback upscaling failed:', fallbackError);
        throw fallbackError;
      }
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="upscaled_${Date.now()}.png"`);
    res.setHeader('Content-Length', processedImage.length);

    // Send the processed image
    res.status(200).send(processedImage);

    // Clean up temporary files
    setTimeout(() => {
      try {
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }, 1000);

  } catch (error) {
    console.error('AI upscaling error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
