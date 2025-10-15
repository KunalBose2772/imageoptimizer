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
    
    // Convert AVIF to PNG using Sharp
    const pngBuffer = await sharp(imageBuffer)
      .png({
        compressionLevel: 6,
        progressive: true
      })
      .toBuffer();

    // Set appropriate headers for PNG file
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.png"');
    res.setHeader('Content-Length', pngBuffer.length);

    // Send the PNG buffer
    res.send(pngBuffer);

  } catch (error) {
    console.error('AVIF to PNG conversion error:', error);
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
