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
    
    // Convert JPG to AVIF using Sharp
    const avifBuffer = await sharp(imageBuffer)
      .avif({
        quality: 80,
        effort: 4,
        lossless: false
      })
      .toBuffer();

    // Set appropriate headers for AVIF file
    res.setHeader('Content-Type', 'image/avif');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.avif"');
    res.setHeader('Content-Length', avifBuffer.length);

    // Send the AVIF buffer
    res.send(avifBuffer);

  } catch (error) {
    console.error('JPG to AVIF conversion error:', error);
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
