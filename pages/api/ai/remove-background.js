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
    const backgroundType = fields.backgroundType?.[0] || 'transparent';
    const backgroundColor = fields.backgroundColor?.[0] || '#ffffff';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Processing background removal request...');
    console.log('Background type:', backgroundType, 'Color:', backgroundColor);

    // Read the input image
    const inputBuffer = fs.readFileSync(file.filepath);
    
    // Process with Sharp
    let processedImage;
    
    try {
      // Convert to RGBA for transparency support
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      
      console.log('Image metadata:', { width: metadata.width, height: metadata.height, format: metadata.format });
      
      // Get image data for analysis
      const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
      
      // Simple background detection based on corner pixels
      const width = info.width;
      const height = info.height;
      const channels = info.channels;
      
      // Get corner pixels
      const corners = [
        { x: 0, y: 0 },                    // top-left
        { x: width - 1, y: 0 },           // top-right
        { x: 0, y: height - 1 },          // bottom-left
        { x: width - 1, y: height - 1 }   // bottom-right
      ];
      
      const cornerColors = corners.map(corner => {
        const index = (corner.y * width + corner.x) * channels;
        return {
          r: data[index],
          g: data[index + 1],
          b: data[index + 2]
        };
      });
      
      // Find most common corner color (likely background)
      const colorCounts = {};
      cornerColors.forEach(color => {
        const key = `${color.r},${color.g},${color.b}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      });
      
      const mostCommonColor = Object.keys(colorCounts).reduce((a, b) => 
        colorCounts[a] > colorCounts[b] ? a : b
      );
      
      const [bgR, bgG, bgB] = mostCommonColor.split(',').map(Number);
      console.log('Detected background color:', { r: bgR, g: bgG, b: bgB });
      
      // Create mask for background pixels
      const tolerance = 30;
      const mask = Buffer.alloc(width * height);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * channels;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Check if pixel is similar to background color
          const isBackground = (
            Math.abs(r - bgR) < tolerance &&
            Math.abs(g - bgG) < tolerance &&
            Math.abs(b - bgB) < tolerance
          );
          
          // Set mask value (0 = background, 255 = foreground)
          mask[y * width + x] = isBackground ? 0 : 255;
        }
      }
      
      // Create new image with transparency or solid background
      const newData = Buffer.alloc(width * height * 4); // RGBA
      
      // Parse background color
      let bgColorR, bgColorG, bgColorB;
      if (backgroundColor.startsWith('#')) {
        const hex = backgroundColor.slice(1);
        bgColorR = parseInt(hex.slice(0, 2), 16);
        bgColorG = parseInt(hex.slice(2, 4), 16);
        bgColorB = parseInt(hex.slice(4, 6), 16);
      } else {
        bgColorR = bgColorG = bgColorB = 255; // Default to white
      }
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const srcIndex = (y * width + x) * channels;
          const dstIndex = (y * width + x) * 4;
          const maskIndex = y * width + x;
          
          if (mask[maskIndex] === 0) {
            // Background pixel
            if (backgroundType === 'transparent') {
              newData[dstIndex] = 0;         // R
              newData[dstIndex + 1] = 0;     // G
              newData[dstIndex + 2] = 0;     // B
              newData[dstIndex + 3] = 0;     // A (transparent)
            } else {
              // Solid color background
              newData[dstIndex] = bgColorR;     // R
              newData[dstIndex + 1] = bgColorG; // G
              newData[dstIndex + 2] = bgColorB; // B
              newData[dstIndex + 3] = 255;      // A (opaque)
            }
          } else {
            // Foreground pixel - keep original colors
            newData[dstIndex] = data[srcIndex];         // R
            newData[dstIndex + 1] = data[srcIndex + 1]; // G
            newData[dstIndex + 2] = data[srcIndex + 2]; // B
            newData[dstIndex + 3] = 255;                // A (opaque)
          }
        }
      }
      
      // Create new image with Sharp
      processedImage = await sharp(newData, {
        raw: {
          width,
          height,
          channels: 4
        }
      }).png().toBuffer();
      
      console.log('Image processed successfully');
      
    } catch (processingError) {
      console.error('Sharp processing error:', processingError);
      
      // Fallback: simple conversion to PNG
      processedImage = await sharp(inputBuffer)
        .png()
        .toBuffer();
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="bg_removed_${Date.now()}.png"`);
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
    console.error('Background removal error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
