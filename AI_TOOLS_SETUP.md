# AI Tools Setup Guide

This guide will help you set up the AI-powered image processing tools for ImageOptimizer.in.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

## Quick Setup

1. **Install Python dependencies:**
   ```bash
   python3 scripts/setup_ai_tools.py
   ```

2. **Or install manually:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## AI Tools Available

### 1. AI Background Remover (`/ai-tools/remove-background`)
- **Technology:** RemBG with U2Net model
- **Features:** Automatic background detection and removal
- **Output:** PNG with transparent or solid color background
- **Batch Processing:** Up to 10 images

### 2. AI Image Upscaler (`/ai-tools/ai-upscale`)
- **Technology:** AI upscaling with enhancement algorithms
- **Features:** 2x, 4x, 8x upscaling with detail enhancement
- **Output:** High-resolution PNG images
- **Batch Processing:** Up to 5 images

### 3. Transparent Background (`/ai-tools/transparent-background`)
- **Technology:** RemBG with adjustable transparency
- **Features:** Customizable transparency levels (0-100%)
- **Output:** PNG with configurable transparency
- **Batch Processing:** Up to 10 images

## API Endpoints

All AI tools are accessible via REST API:

- `POST /api/ai/remove-background`
- `POST /api/ai/ai-upscale`
- `POST /api/ai/transparent-background`

### API Usage Example

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('upscaleFactor', '2x');

const response = await fetch('/api/ai/ai-upscale', {
  method: 'POST',
  body: formData,
});

const blob = await response.blob();
// Process the returned image blob
```

## File Size Limits

- **Maximum file size:** 50MB per image
- **Supported formats:** JPG, PNG, WebP, BMP, TIFF
- **Output format:** PNG (for transparency support)

## Performance Notes

- **First run:** May take longer as AI models are downloaded
- **Processing time:** 30-60 seconds per image (depending on size)
- **Memory usage:** ~2-4GB RAM recommended for optimal performance
- **Storage:** Temporary files are automatically cleaned up after 24 hours

## Troubleshooting

### Common Issues

1. **"RemBG not installed" error:**
   ```bash
   pip install rembg
   ```

2. **"Module not found" errors:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Memory errors with large images:**
   - Reduce image size before processing
   - Process images one at a time instead of batch

4. **Slow processing:**
   - Ensure you have sufficient RAM (4GB+ recommended)
   - Close other applications to free up memory

### Python Version Issues

If you encounter Python version conflicts:

```bash
# Check Python version
python3 --version

# Use specific Python version
python3.8 scripts/setup_ai_tools.py
# or
python3.9 scripts/setup_ai_tools.py
```

## Development

### Adding New AI Tools

1. Create the frontend page in `pages/ai-tools/`
2. Create the API endpoint in `pages/api/ai/`
3. Create the Python script in `scripts/`
4. Update the sitemap and navigation

### Testing AI Tools

```bash
# Test individual tools
python3 scripts/remove_background.py input.jpg output.png
python3 scripts/ai_upscale.py input.jpg output.png 2x
python3 scripts/transparent_background.py input.jpg output.png 100
```

## Production Deployment

### Environment Variables

Set these environment variables in production:

```bash
NODE_ENV=production
PYTHON_PATH=/usr/bin/python3
MAX_FILE_SIZE=52428800  # 50MB
CLEANUP_INTERVAL=86400  # 24 hours
```

### Server Requirements

- **CPU:** 4+ cores recommended
- **RAM:** 8GB+ recommended
- **Storage:** 10GB+ for temporary files
- **Python:** 3.8+ with pip
- **Node.js:** 16+ with npm

### Docker Support

```dockerfile
FROM node:16-alpine
RUN apk add --no-cache python3 py3-pip
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify file permissions and paths

## License

These AI tools use open-source libraries:
- RemBG: MIT License
- Pillow: HPND License
- NumPy: BSD License
- SciPy: BSD License
