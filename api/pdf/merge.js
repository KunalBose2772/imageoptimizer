import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    // Parse the form data
    const form = formidable({
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: ({ mimetype }) => {
        // Only allow PDF files
        return mimetype && mimetype.includes('application/pdf');
      },
    });

    const [fields, files] = await form.parse(req);
    
    const fileCount = parseInt(fields.fileCount?.[0] || '0');
    
    if (fileCount < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files are required for merging' });
    }

    // Collect all uploaded files
    const uploadedFiles = [];
    for (let i = 0; i < fileCount; i++) {
      const fileKey = `file_${i}`;
      if (files[fileKey] && files[fileKey][0]) {
        uploadedFiles.push(files[fileKey][0]);
      }
    }

    if (uploadedFiles.length < 2) {
      return res.status(400).json({ error: 'Not enough valid PDF files uploaded' });
    }

    // Generate output filename
    const outputFilename = `merged_${Date.now()}.pdf`;
    const outputPath = path.join('./public/uploads', outputFilename);

    // Note: In a real implementation, you would use PyMuPDF (fitz) here
    // For now, we'll create a placeholder that simulates the merge process
    
    // This is a placeholder implementation
    // In production, you would:
    // 1. Import PyMuPDF: import fitz from 'pymupdf'
    // 2. Create a new PDF document
    // 3. Iterate through uploaded files and add their pages
    // 4. Save the merged document
    
    // For demonstration, we'll copy the first file as the "merged" result
    // In production, replace this with actual PyMuPDF merging logic
    fs.copyFileSync(uploadedFiles[0].filepath, outputPath);

    // Read the "merged" file
    const mergedBuffer = fs.readFileSync(outputPath);

    // Clean up temporary files
    uploadedFiles.forEach(file => {
      try {
        fs.unlinkSync(file.filepath);
      } catch (error) {
        console.error('Error cleaning up file:', error);
      }
    });
    
    try {
      fs.unlinkSync(outputPath);
    } catch (error) {
      console.error('Error cleaning up output file:', error);
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.setHeader('Content-Length', mergedBuffer.length);

    // Send the merged file
    res.status(200).send(mergedBuffer);

  } catch (error) {
    console.error('PDF merge error:', error);
    
    // Clean up any temporary files on error
    try {
      // Clean up all potential uploaded files
      const uploadDir = './public/uploads';
      const files = fs.readdirSync(uploadDir);
      files.forEach(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        // Delete files older than 1 hour to clean up any orphaned files
        if (Date.now() - stats.mtime.getTime() > 60 * 60 * 1000) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    res.status(500).json({ 
      error: 'PDF merge failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/*
// Production PyMuPDF Implementation Example:
// 
// import fitz from 'pymupdf';
// 
// export default async function handler(req, res) {
//   // ... file upload logic ...
//   
//   try {
//     // Create a new PDF document
//     const mergedDoc = new fitz.Document();
//     
//     // Process each uploaded file
//     for (const uploadedFile of uploadedFiles) {
//       const pdfDoc = fitz.open(uploadedFile.filepath);
//       
//       // Insert all pages from this document
//       mergedDoc.insertPDF(pdfDoc);
//       
//       pdfDoc.close();
//     }
//     
//     // Save the merged document
//     mergedDoc.save(outputPath);
//     mergedDoc.close();
//     
//     // ... rest of the logic ...
//   } catch (error) {
//     // ... error handling ...
//   }
// }
*/
