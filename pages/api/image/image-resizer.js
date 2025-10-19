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
    const { file, resizeMode, width, height, percentage, maintainAspectRatio } = req.body;
    
    console.log('API received:', { resizeMode, width, height, percentage, maintainAspectRatio });
    
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

    // Calculate new dimensions based on resize mode
    let newWidth, newHeight;

    if (resizeMode === 'dimensions') {
      newWidth = parseInt(width) || 0;
      newHeight = parseInt(height) || 0;
      
      if (newWidth <= 0 || newHeight <= 0) {
        return res.status(400).json({ error: 'Width and height must be positive numbers' });
      }
      
      // For exact dimensions, don't maintain aspect ratio unless specified
      if (maintainAspectRatio === 'true' || maintainAspectRatio === true) {
        const aspectRatio = originalWidth / originalHeight;
        const targetAspectRatio = newWidth / newHeight;
        if (Math.abs(aspectRatio - targetAspectRatio) > 0.01) {
          // Adjust to maintain original aspect ratio
          if (aspectRatio > targetAspectRatio) {
            newHeight = Math.round(newWidth / aspectRatio);
          } else {
            newWidth = Math.round(newHeight * aspectRatio);
          }
        }
      }
    } else if (resizeMode === 'width') {
      newWidth = parseInt(width) || 0;
      
      if (newWidth <= 0) {
        return res.status(400).json({ error: 'Width must be a positive number' });
      }
      
      // Calculate height to maintain aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      newHeight = Math.round(newWidth / aspectRatio);
    } else if (resizeMode === 'height') {
      newHeight = parseInt(height) || 0;
      
      if (newHeight <= 0) {
        return res.status(400).json({ error: 'Height must be a positive number' });
      }
      
      // Calculate width to maintain aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      newWidth = Math.round(newHeight * aspectRatio);
    } else if (resizeMode === 'percentage') {
      const scale = parseInt(percentage) / 100;
      if (scale <= 0 || scale > 5) {
        return res.status(400).json({ error: 'Percentage must be between 1 and 500' });
      }
      newWidth = Math.round(originalWidth * scale);
      newHeight = Math.round(originalHeight * scale);
    } else if (resizeMode === 'fit') {
      // Fit to size while maintaining aspect ratio
      const maxWidth = parseInt(width) || originalWidth;
      const maxHeight = parseInt(height) || originalHeight;
      
      if (maxWidth <= 0 || maxHeight <= 0) {
        return res.status(400).json({ error: 'Fit dimensions must be positive numbers' });
      }
      
      const scaleX = maxWidth / originalWidth;
      const scaleY = maxHeight / originalHeight;
      const scale = Math.min(scaleX, scaleY);
      
      newWidth = Math.round(originalWidth * scale);
      newHeight = Math.round(originalHeight * scale);
    } else {
      return res.status(400).json({ error: 'Invalid resize mode' });
    }

    // Validate dimensions
    if (newWidth <= 0 || newHeight <= 0) {
      return res.status(400).json({ error: 'Invalid dimensions' });
    }

    if (newWidth > 10000 || newHeight > 10000) {
      return res.status(400).json({ error: 'Dimensions too large (max 10000px)' });
    }

    // Apply resizing
    const processedBuffer = await sharpInstance
      .resize(newWidth, newHeight, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="resized.jpg"');
    res.setHeader('X-Original-Size', `${originalWidth}x${originalHeight}`);
    res.setHeader('X-New-Size', `${newWidth}x${newHeight}`);
    
    res.send(processedBuffer);
  } catch (error) {
    console.error('Resize error:', error);
    res.status(500).json({ error: 'Resize failed' });
  }
}
