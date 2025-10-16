# Complete Hostinger Deployment Guide for ImageOptimizer

## Prerequisites
- Hostinger Premium/Business hosting account
- Domain name (can be purchased through Hostinger)
- FileZilla or similar FTP client
- Node.js installed locally for building

## Project Analysis
Your ImageOptimizer project is a Next.js 14 application with:
- 300+ file conversion tools
- API routes for file processing
- Image processing with Sharp library
- Tailwind CSS styling
- File upload functionality

## Step 1: Choose Hostinger Plan

### Recommended Plans:
1. **Premium Web Hosting** ($2.99/month)
   - 100 GB SSD storage
   - Unlimited bandwidth
   - Node.js support
   - SSH access
   - Free SSL certificate

2. **Business Web Hosting** ($3.99/month)
   - 200 GB SSD storage
   - Unlimited bandwidth
   - Node.js support
   - SSH access
   - Free SSL certificate
   - Daily backups

## Step 2: Prepare Project for Hostinger

### Option A: Static Export (Recommended for File Processing)
Since Hostinger doesn't support Next.js API routes natively, we'll use a hybrid approach:

1. **Create a static frontend build**
2. **Use external API service for file processing**

### Step 2.1: Modify next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Remove API routes for static export
  // Keep only the frontend components
  swcMinify: true,
  compress: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        bufferutil: false,
        'utf-8-validate': false,
        ws: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
```

### Step 2.2: Create API Service Configuration
Create a new file `utils/apiConfig.js`:

```javascript
// API Configuration for external service
export const API_CONFIG = {
  // Option 1: Use a separate API service (recommended)
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://your-api-service.com',
  
  // Option 2: Use Cloudinary or similar service for image processing
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },
  
  // Option 3: Use third-party APIs
  thirdPartyAPIs: {
    imageConversion: 'https://api.convertio.co',
    pdfProcessing: 'https://api.ilovepdf.com',
  }
};

// Helper function to handle API calls
export const processFile = async (file, conversionType) => {
  try {
    // Implement file processing logic here
    // This will call external APIs instead of local API routes
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', conversionType);
    
    const response = await fetch(`${API_CONFIG.baseURL}/convert`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Conversion failed');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
};
```

### Step 2.3: Update File Upload Components
Modify your file upload components to use external APIs instead of local API routes:

```javascript
// Example: Update FileUploader component
import { processFile } from '../utils/apiConfig';

const FileUploader = ({ onFileProcessed }) => {
  const handleFileUpload = async (file) => {
    try {
      // Process file using external API
      const processedFile = await processFile(file, 'avif-to-jpg');
      onFileProcessed(processedFile);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Rest of your component logic
};
```

## Step 3: Build and Prepare Files

### Step 3.1: Install Dependencies and Build
```bash
# Install dependencies
npm install

# Create static build
npm run build

# The build will create an 'out' folder with static files
```

### Step 3.2: Prepare Upload Files
The build process creates an `out` folder containing:
- Static HTML files
- CSS files
- JavaScript files
- Images and assets

## Step 4: Upload to Hostinger

### Step 4.1: Access Hostinger File Manager
1. Log into your Hostinger control panel
2. Go to "File Manager"
3. Navigate to `public_html` folder
4. Delete any existing files (index.html, etc.)

### Step 4.2: Upload Your Files
1. **Using File Manager (Recommended):**
   - Select all files from your `out` folder
   - Upload them to `public_html`
   - Ensure folder structure is maintained

2. **Using FTP Client:**
   - Connect using FTP credentials from Hostinger
   - Upload all contents of `out` folder to `public_html`

### Step 4.3: Set Up .htaccess for SPA
Create a `.htaccess` file in `public_html`:

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>
```

## Step 5: Configure Domain and SSL

### Step 5.1: Domain Setup
1. In Hostinger control panel, go to "Domains"
2. Add your domain name
3. Point DNS to Hostinger nameservers:
   ```
   ns1.dns-parking.com
   ns2.dns-parking.com
   ```

### Step 5.2: SSL Certificate
1. Go to "SSL" section in control panel
2. Enable "Let's Encrypt SSL" (free)
3. Force HTTPS redirect

## Step 6: Alternative API Solutions

Since you need file processing capabilities, consider these options:

### Option 1: External API Services
- **Cloudinary** - Image processing and conversion
- **ConvertAPI** - Document and image conversion
- **ILovePDF API** - PDF processing
- **CloudConvert** - General file conversion

### Option 2: Separate API Server
Deploy your API routes separately on:
- **Vercel** (free tier)
- **Railway** (free tier)
- **Render** (free tier)
- **Heroku** (paid)

### Option 3: Client-Side Processing
Use JavaScript libraries for client-side processing:
- **PDF-lib** for PDF manipulation
- **Sharp.js** (WebAssembly version) for image processing
- **FFmpeg.wasm** for video processing

## Step 7: Environment Variables

Set up environment variables in Hostinger:
1. Go to "Advanced" → "Environment Variables"
2. Add:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-api-service.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```

## Step 8: Testing and Optimization

### Step 8.1: Test Your Site
1. Visit your domain
2. Test all conversion tools
3. Check mobile responsiveness
4. Verify SSL certificate

### Step 8.2: Performance Optimization
1. Enable Gzip compression (already in .htaccess)
2. Set up caching headers
3. Optimize images
4. Use CDN (Cloudflare free tier)

## Step 9: Monitoring and Maintenance

### Step 9.1: Set Up Monitoring
- Google Analytics
- Google Search Console
- Uptime monitoring

### Step 9.2: Regular Maintenance
- Update dependencies
- Monitor file storage usage
- Check for security updates
- Backup your site regularly

## Troubleshooting

### Common Issues:

1. **404 Errors on Refresh:**
   - Ensure .htaccess file is properly configured
   - Check that all routes are handled by index.html

2. **File Upload Not Working:**
   - Implement client-side file processing
   - Use external API services
   - Check file size limits

3. **Slow Loading:**
   - Enable compression
   - Optimize images
   - Use CDN

4. **SSL Issues:**
   - Wait 24-48 hours for SSL propagation
   - Clear browser cache
   - Check DNS settings

## Cost Breakdown

- **Hostinger Premium Hosting:** $2.99/month
- **Domain:** $0.99/year (if purchased through Hostinger)
- **SSL Certificate:** Free (Let's Encrypt)
- **External API Services:** $0-50/month (depending on usage)

## Alternative Hosting Options

If you need full Next.js functionality:

1. **Vercel** - Best for Next.js (free tier available)
2. **Netlify** - Good for static sites (free tier)
3. **Railway** - Good for full-stack apps (free tier)
4. **Render** - Good for Node.js apps (free tier)

## Success Checklist

- [ ] Hostinger account created
- [ ] Project modified for static export
- [ ] External API service configured
- [ ] Files uploaded to public_html
- [ ] .htaccess file configured
- [ ] Domain configured
- [ ] SSL certificate enabled
- [ ] Site tested and working
- [ ] Performance optimized
- [ ] Monitoring set up

## Your Live URL
After successful deployment: `https://yourdomain.com`

## Next Steps
1. Set up analytics
2. Configure backup strategy
3. Monitor performance
4. Plan for scaling
5. Consider upgrading to VPS if needed

---

**Note:** This approach converts your Next.js app to a static site with external API integration. For full Next.js functionality, consider using Vercel, Netlify, or similar platforms that support serverless functions.
