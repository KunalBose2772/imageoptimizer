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
    const { file, cropMode, customWidth, customHeight, socialTemplate, maintainAspectRatio } = req.body;
    
    console.log('API received:', { cropMode, customWidth, customHeight, socialTemplate, maintainAspectRatio });
    
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
    let outputFormat = 'jpeg';

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
    } else if (cropMode === 'circle') {
      // Crop to circle - use the smaller dimension for square, then apply circle mask
      const size = Math.min(originalWidth, originalHeight);
      const left = Math.floor((originalWidth - size) / 2);
      const top = Math.floor((originalHeight - size) / 2);
      
      cropOptions = {
        left: left,
        top: top,
        width: size,
        height: size
      };
      outputFormat = 'png'; // Use PNG for transparency
    } else if (cropMode === 'social') {
      // Social media templates
      const templates = {
        'instagram-square': { width: 1080, height: 1080 },
        'instagram-story': { width: 1080, height: 1920 },
        'facebook-cover': { width: 1200, height: 630 },
        'twitter-header': { width: 1500, height: 500 },
        'linkedin-banner': { width: 1584, height: 396 },
        'youtube-thumbnail': { width: 1280, height: 720 },
        'pinterest-pin': { width: 1000, height: 1500 }
      };
      
      const template = templates[socialTemplate] || templates['instagram-square'];
      const targetWidth = template.width;
      const targetHeight = template.height;
      
      // Calculate crop area to fit the template
      const aspectRatio = originalWidth / originalHeight;
      const targetAspectRatio = targetWidth / targetHeight;
      
      let cropWidth, cropHeight;
      if (aspectRatio > targetAspectRatio) {
        // Image is wider, crop width
        cropHeight = originalHeight;
        cropWidth = Math.round(originalHeight * targetAspectRatio);
      } else {
        // Image is taller, crop height
        cropWidth = originalWidth;
        cropHeight = Math.round(originalWidth / targetAspectRatio);
      }
      
      const left = Math.floor((originalWidth - cropWidth) / 2);
      const top = Math.floor((originalHeight - cropHeight) / 2);
      
      cropOptions = {
        left: left,
        top: top,
        width: cropWidth,
        height: cropHeight
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
    let processedBuffer;
    if (cropMode === 'circle') {
      // Create circular mask
      const size = cropOptions.width;
      const mask = Buffer.from(`
        <svg width="${size}" height="${size}">
          <defs>
            <mask id="circle">
              <rect width="${size}" height="${size}" fill="white"/>
              <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="black"/>
            </mask>
          </defs>
          <rect width="${size}" height="${size}" fill="white" mask="url(#circle)"/>
        </svg>
      `);
      
      processedBuffer = await sharpInstance
        .extract(cropOptions)
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toBuffer();
    } else {
      // Regular rectangular crop
      processedBuffer = await sharpInstance
        .extract(cropOptions)
        .jpeg({ quality: 90 })
        .toBuffer();
    }

    // Set response headers
    const contentType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
    const filename = outputFormat === 'png' ? 'cropped.png' : 'cropped.jpg';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Original-Size', `${originalWidth}x${originalHeight}`);
    res.setHeader('X-Cropped-Size', `${cropOptions.width}x${cropOptions.height}`);
    
    res.send(processedBuffer);
  } catch (error) {
    console.error('Crop error:', error);
    res.status(500).json({ error: 'Crop failed' });
  }
}
