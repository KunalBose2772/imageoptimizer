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
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file, 'base64');
    
    // Process with Sharp
    const processedBuffer = await sharp(buffer)
      .avif({ quality: 80 })
      .toBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'image/avif');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.avif"');
    
    res.send(processedBuffer);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
}
