import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Create preview with scanning animation
async function createScanningPreview(imageBuffer) {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  
  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  
  // Convert to grayscale
  const grayData = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const pixelIndex = i * channels;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];
    grayData[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  
  // Apply Gaussian blur
  const blurredData = applyGaussianBlur(grayData, width, height);
  
  // Edge detection
  const edges = await detectEdgesCanny(blurredData, width, height);
  
  // Find background using flood fill
  const backgroundMask = await findBackgroundFloodFill(data, width, height, channels, edges);
  
  // Create preview image showing background detection
  const previewData = Buffer.alloc(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIndex = (y * width + x) * channels;
      const dstIndex = (y * width + x) * 4;
      const maskIndex = y * width + x;
      
      // Copy original RGB
      previewData[dstIndex] = data[srcIndex];         // R
      previewData[dstIndex + 1] = data[srcIndex + 1]; // G
      previewData[dstIndex + 2] = data[srcIndex + 2]; // B
      
      // Highlight background in red
      if (backgroundMask[maskIndex] === 255) {
        previewData[dstIndex] = 255;     // R (red)
        previewData[dstIndex + 1] = 0;   // G
        previewData[dstIndex + 2] = 0;   // B
        previewData[dstIndex + 3] = 200; // A (semi-transparent)
      } else {
        previewData[dstIndex + 3] = 255; // A (opaque)
      }
    }
  }
  
  return {
    preview: await sharp(previewData, {
      raw: { width, height, channels: 4 }
    }).png().toBuffer(),
    backgroundMask,
    edges,
    metadata: { width, height }
  };
}

// Apply Gaussian blur
function applyGaussianBlur(data, width, height) {
  const kernel = [1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, 36, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1];
  const kernelSize = 5;
  const kernelSum = 256;
  
  const blurred = new Uint8Array(width * height);
  
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      let sum = 0;
      
      for (let ky = -2; ky <= 2; ky++) {
        for (let kx = -2; kx <= 2; kx++) {
          const pixelIndex = (y + ky) * width + (x + kx);
          const kernelIndex = (ky + 2) * kernelSize + (kx + 2);
          sum += data[pixelIndex] * kernel[kernelIndex];
        }
      }
      
      blurred[y * width + x] = Math.round(sum / kernelSum);
    }
  }
  
  return blurred;
}

// Canny edge detection
async function detectEdgesCanny(data, width, height) {
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  
  const gx = new Int16Array(width * height);
  const gy = new Int16Array(width * height);
  const magnitude = new Uint8Array(width * height);
  const direction = new Float32Array(width * height);
  
  // Calculate gradients
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sumX = 0, sumY = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIndex = (y + ky) * width + (x + kx);
          const kernelIndex = (ky + 1) * 3 + (kx + 1);
          
          sumX += data[pixelIndex] * sobelX[kernelIndex];
          sumY += data[pixelIndex] * sobelY[kernelIndex];
        }
      }
      
      const index = y * width + x;
      gx[index] = sumX;
      gy[index] = sumY;
      magnitude[index] = Math.sqrt(sumX * sumX + sumY * sumY);
      direction[index] = Math.atan2(sumY, sumX);
    }
  }
  
  // Non-maximum suppression
  const suppressed = new Uint8Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = y * width + x;
      const mag = magnitude[index];
      const dir = direction[index];
      
      let angle = (dir * 180 / Math.PI) % 180;
      if (angle < 0) angle += 180;
      
      let neighbor1, neighbor2;
      if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle <= 180)) {
        neighbor1 = magnitude[index - 1];
        neighbor2 = magnitude[index + 1];
      } else if (angle >= 22.5 && angle < 67.5) {
        neighbor1 = magnitude[(y - 1) * width + (x + 1)];
        neighbor2 = magnitude[(y + 1) * width + (x - 1)];
      } else if (angle >= 67.5 && angle < 112.5) {
        neighbor1 = magnitude[(y - 1) * width + x];
        neighbor2 = magnitude[(y + 1) * width + x];
      } else {
        neighbor1 = magnitude[(y - 1) * width + (x - 1)];
        neighbor2 = magnitude[(y + 1) * width + (x + 1)];
      }
      
      if (mag >= neighbor1 && mag >= neighbor2) {
        suppressed[index] = mag;
      }
    }
  }
  
  // Double threshold
  const highThreshold = 50;
  const lowThreshold = 20;
  const edges = new Uint8Array(width * height);
  
  for (let i = 0; i < width * height; i++) {
    if (suppressed[i] >= highThreshold) {
      edges[i] = 255;
    } else if (suppressed[i] >= lowThreshold) {
      edges[i] = 128;
    }
  }
  
  return edges;
}

// Advanced background detection using multiple techniques
async function findBackgroundFloodFill(data, width, height, channels, edges) {
  const mask = new Uint8Array(width * height);
  
  // Step 1: Sample background colors from edges and corners
  const backgroundColors = await sampleBackgroundColors(data, width, height, channels);
  console.log('Sampled background colors:', backgroundColors.length);
  
  // Step 2: Use color clustering to find dominant background colors
  const dominantColors = await findDominantBackgroundColors(backgroundColors);
  console.log('Dominant background colors:', dominantColors);
  
  // Step 3: Create mask based on color similarity and edge information
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const pixelIndex = index * channels;
      
      const pixel = {
        r: data[pixelIndex],
        g: data[pixelIndex + 1],
        b: data[pixelIndex + 2]
      };
      
      // Check if pixel matches any dominant background color
      let isBackground = false;
      for (const bgColor of dominantColors) {
        const colorDiff = Math.abs(pixel.r - bgColor.r) + 
                         Math.abs(pixel.g - bgColor.g) + 
                         Math.abs(pixel.b - bgColor.b);
        
        if (colorDiff < 50) { // More lenient tolerance
          isBackground = true;
          break;
        }
      }
      
      // Also check if it's not a strong edge
      const isEdge = edges[index] > 80;
      
      if (isBackground && !isEdge) {
        mask[index] = 255; // Background
      }
    }
  }
  
  // Step 4: Apply flood fill from detected background regions
  const visited = new Uint8Array(width * height);
  const queue = [];
  
  // Find all background pixels and add them to queue
  for (let i = 0; i < width * height; i++) {
    if (mask[i] === 255) {
      const x = i % width;
      const y = Math.floor(i / width);
      queue.push({ x, y });
    }
  }
  
  // Flood fill from all background pixels
  while (queue.length > 0) {
    const { x, y } = queue.shift();
    const index = y * width + x;
    
    if (visited[index] || x < 0 || x >= width || y < 0 || y >= height) {
      continue;
    }
    
    visited[index] = 1;
    
    const pixelIndex = index * channels;
    const pixel = {
      r: data[pixelIndex],
      g: data[pixelIndex + 1],
      b: data[pixelIndex + 2]
    };
    
    // Check if this pixel should be background
    let shouldBeBackground = false;
    for (const bgColor of dominantColors) {
      const colorDiff = Math.abs(pixel.r - bgColor.r) + 
                       Math.abs(pixel.g - bgColor.g) + 
                       Math.abs(pixel.b - bgColor.b);
      
      if (colorDiff < 60) { // Even more lenient for flood fill
        shouldBeBackground = true;
        break;
      }
    }
    
    const isEdge = edges[index] > 100;
    
    if (shouldBeBackground && !isEdge) {
      mask[index] = 255; // Background
      
      // Add neighbors to queue
      queue.push({ x: x + 1, y });
      queue.push({ x: x - 1, y });
      queue.push({ x, y: y + 1 });
      queue.push({ x, y: y - 1 });
    }
  }
  
  return mask;
}

// Sample background colors from edges and corners
async function sampleBackgroundColors(data, width, height, channels) {
  const samples = [];
  const sampleSize = Math.min(200, Math.floor(width * height * 0.02));
  
  // Sample from all edges with more coverage
  for (let i = 0; i < sampleSize; i++) {
    let x, y;
    
    if (i < sampleSize * 0.3) {
      // Top edge - more coverage
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * Math.min(20, height));
    } else if (i < sampleSize * 0.6) {
      // Bottom edge - more coverage
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * Math.min(20, height)) + height - Math.min(20, height);
    } else if (i < sampleSize * 0.8) {
      // Left edge - more coverage
      x = Math.floor(Math.random() * Math.min(20, width));
      y = Math.floor(Math.random() * height);
    } else {
      // Right edge - more coverage
      x = Math.floor(Math.random() * Math.min(20, width)) + width - Math.min(20, width);
      y = Math.floor(Math.random() * height);
    }
    
    const index = (y * width + x) * channels;
    samples.push({
      r: data[index],
      g: data[index + 1],
      b: data[index + 2]
    });
  }
  
  return samples;
}

// Find dominant background colors using improved clustering
async function findDominantBackgroundColors(samples) {
  const colors = [];
  const tolerance = 60; // More lenient clustering
  
  for (const sample of samples) {
    let foundCluster = false;
    
    for (const cluster of colors) {
      const avg = cluster.average;
      const colorDiff = Math.abs(sample.r - avg.r) + 
                       Math.abs(sample.g - avg.g) + 
                       Math.abs(sample.b - avg.b);
      
      if (colorDiff < tolerance) {
        cluster.pixels.push(sample);
        // Update average
        cluster.average = {
          r: Math.round(cluster.pixels.reduce((sum, p) => sum + p.r, 0) / cluster.pixels.length),
          g: Math.round(cluster.pixels.reduce((sum, p) => sum + p.g, 0) / cluster.pixels.length),
          b: Math.round(cluster.pixels.reduce((sum, p) => sum + p.b, 0) / cluster.pixels.length)
        };
        foundCluster = true;
        break;
      }
    }
    
    if (!foundCluster) {
      colors.push({
        pixels: [sample],
        average: { ...sample }
      });
    }
  }
  
  // Sort by cluster size and return top 3
  colors.sort((a, b) => b.pixels.length - a.pixels.length);
  return colors.slice(0, 3).map(cluster => cluster.average);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024,
      filter: ({ mimetype }) => {
        return mimetype && mimetype.startsWith('image/');
      },
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Creating scanning preview...');

    const inputBuffer = fs.readFileSync(file.filepath);
    const result = await createScanningPreview(inputBuffer);
    
    // Convert preview to base64
    const previewBase64 = result.preview.toString('base64');
    
    // Calculate background percentage
    const totalPixels = result.metadata.width * result.metadata.height;
    const backgroundPixels = Array.from(result.backgroundMask).filter(pixel => pixel === 255).length;
    const backgroundPercentage = Math.round((backgroundPixels / totalPixels) * 100);
    
    res.status(200).json({
      preview: `data:image/png;base64,${previewBase64}`,
      backgroundPercentage,
      confidence: backgroundPercentage > 30 ? 'High' : backgroundPercentage > 15 ? 'Medium' : 'Low',
      detected: backgroundPercentage > 10
    });

  } catch (error) {
    console.error('Preview creation error:', error);
    return res.status(500).json({ 
      error: 'Preview creation failed',
      details: error.message 
    });
  }
}
