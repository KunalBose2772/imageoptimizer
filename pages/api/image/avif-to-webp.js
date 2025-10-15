import sharp from 'sharp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the file from the request body
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Convert base64 string to buffer
    const imageBuffer = Buffer.from(file, 'base64');
    
    // Convert AVIF to WEBP using Sharp
    const webpBuffer = await sharp(imageBuffer)
      .webp({
        quality: 90,
        effort: 6,
        lossless: false
      })
      .toBuffer();

    // Set appropriate headers for WEBP file
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.webp"');
    res.setHeader('Content-Length', webpBuffer.length);

    // Send the WEBP buffer
    res.send(webpBuffer);

  } catch (error) {
    console.error('AVIF to WEBP conversion error:', error);
    res.status(500).json({ 
      error: 'Conversion failed', 
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
