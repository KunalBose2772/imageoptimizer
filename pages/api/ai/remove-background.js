import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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

    // Create temporary file paths
    const inputPath = file.filepath;
    const outputDir = path.join(process.cwd(), 'public', 'uploads');
    const outputFilename = `bg_removed_${Date.now()}.png`;
    const outputPath = path.join(outputDir, outputFilename);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Run Python script for background removal using RemBG
    const pythonScript = path.join(process.cwd(), 'scripts', 'remove_background.py');
    
    return new Promise((resolve) => {
      const pythonProcess = spawn('python3', [
        pythonScript,
        inputPath,
        outputPath,
        backgroundType,
        backgroundColor
      ]);

      let errorOutput = '';
      let resolved = false;

      // Set a timeout to prevent infinite waiting
      const timeout = setTimeout(() => {
        if (!resolved) {
          pythonProcess.kill();
          console.error('Python process timed out');
          return res.status(500).json({ 
            error: 'Processing timed out',
            details: 'The background removal process took too long to complete'
          });
        }
      }, 60000); // 60 second timeout

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.log('Python stderr:', data.toString());
      });

      pythonProcess.stdout.on('data', (data) => {
        console.log('Python stdout:', data.toString());
      });

      pythonProcess.on('close', (code) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        
        console.log('Python process exited with code:', code);
        if (code !== 0) {
          console.error('Python script error:', errorOutput);
          return res.status(500).json({ 
            error: 'Background removal failed',
            details: errorOutput 
          });
        }

        // Check if output file exists
        if (!fs.existsSync(outputPath)) {
          return res.status(500).json({ error: 'Output file not created' });
        }

        // Read the processed image
        const processedImage = fs.readFileSync(outputPath);
        
        // Set appropriate headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
        res.setHeader('Content-Length', processedImage.length);

        // Send the processed image
        res.status(200).send(processedImage);

        // Clean up temporary files
        setTimeout(() => {
          try {
            if (fs.existsSync(inputPath)) {
              fs.unlinkSync(inputPath);
            }
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
        }, 1000);

        resolve();
      });
    });

  } catch (error) {
    console.error('Background removal error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
