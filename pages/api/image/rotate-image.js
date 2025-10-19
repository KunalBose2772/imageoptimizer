import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file, cropMode, customWidth, customHeight, maintainAspectRatio } = req.body;
    
    console.log('API received:', { cropMode, customWidth, customHeight, maintainAspectRatio });
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file, 'base64');
    
    let sharpInstance = sharp(buffer);
    
    // Get original image metadata
    const metadata = await sharpInstance.metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    let cropOptions = {};

    if (cropMode === 'square') {
      // Crop to square - use the smaller dimension
      const size = Math.min(originalWidth, originalHeight);
      const left = Math.floor((originalWidth - size) / 2);
      const top = Math.floor((originalHeight - size) / 2);
      
      cropOptions = {
        left: left,
        top: top,
        width: size,
        height: size
      };
    } else if (cropMode === 'custom') {
      // Custom dimensions
      const targetWidth = parseInt(customWidth);
      const targetHeight = parseInt(customHeight);
      
      if (targetWidth <= 0 || targetHeight <= 0) {
        return res.status(400).json({ error: 'Invalid custom dimensions' });
      }

      if (targetWidth > originalWidth || targetHeight > originalHeight) {
        return res.status(400).json({ error: 'Crop dimensions cannot be larger than original image' });
      }

      // Center the crop
      const left = Math.floor((originalWidth - targetWidth) / 2);
      const top = Math.floor((originalHeight - targetHeight) / 2);
      
      cropOptions = {
        left: left,
        top: top,
        width: targetWidth,
        height: targetHeight
      };
    } else if (cropMode === 'free') {
      // Free crop - center crop
      const size = Math.min(originalWidth, originalHeight);
      const left = Math.floor((originalWidth - size) / 2);
      const top = Math.floor((originalHeight - size) / 2);
      
      cropOptions = {
        left: left,
        top: top,
        width: size,
        height: size
      };
    }

    // Validate crop options
    if (cropOptions.left < 0 || cropOptions.top < 0 || 
        cropOptions.width <= 0 || cropOptions.height <= 0 ||
        cropOptions.left + cropOptions.width > originalWidth ||
        cropOptions.top + cropOptions.height > originalHeight) {
      return res.status(400).json({ error: 'Invalid crop parameters' });
    }

    // Apply cropping
    const processedBuffer = await sharpInstance
      .extract(cropOptions)
      .jpeg({ quality: 90 })
      .toBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="cropped.jpg"');
    res.setHeader('X-Original-Size', `${originalWidth}x${originalHeight}`);
    res.setHeader('X-Cropped-Size', `${cropOptions.width}x${cropOptions.height}`);
    
    res.send(processedBuffer);
  } catch (error) {
    console.error('Crop error:', error);
    res.status(500).json({ error: 'Crop failed' });
  }
}
