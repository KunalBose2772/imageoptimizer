# Converter Page Creation Template

## Overview
This document provides a **strict template** for creating new converter pages that are 100% consistent with existing working pages. Follow this template exactly to avoid any errors or inconsistencies.

## ✅ Working Page Examples
- `pages/image-tools/avif-to-jpg.js` ✅
- `pages/image-tools/avif-to-png.js` ✅  
- `pages/image-tools/avif-to-webp.js` ✅
- `pages/image-tools/jpg-to-avif.js` ✅
- `pages/image-tools/png-to-avif.js` ✅
- `pages/pdf-tools/merge-pdf.js` ✅

## 🚫 What NOT to Do
- ❌ Don't create custom button components
- ❌ Don't use different import structures
- ❌ Don't create custom FAQ components
- ❌ Don't use different file handling logic
- ❌ Don't create different CSS class patterns

## 📋 Step-by-Step Creation Process

### Step 1: Copy Base Template
**Always start by copying `pages/image-tools/avif-to-jpg.js` as your base template.**

### Step 2: Update Imports (Keep Exactly the Same)
```javascript
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import FileUploader from '../../components/FileUploader';
import { ConvertButton, DownloadButton } from '../../components/ActionButton';
import { 
  Image, 
  Download, 
  CheckCircle, 
  Info, 
  Zap,
  Shield,
  Clock,
  Star,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
```

### Step 3: Update Component Name and Function
```javascript
// Change component name
const WebpToAvifPage = () => {
  // Keep all state variables exactly the same
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(90);
  const [conversionMode, setConversionMode] = useState('single');
```

### Step 4: Update File Handling Logic
```javascript
// Keep handleFileSelect exactly the same
const handleFileSelect = (files) => {
  if (files) {
    const fileArray = Array.isArray(files) ? files : [files];
    setSelectedFiles(fileArray);
    setConvertedFiles([]);
  } else {
    setSelectedFiles([]);
    setConvertedFiles([]);
  }
};
```

### Step 5: Update API Endpoint in handleConvert
```javascript
// ONLY change the API endpoint URL
const response = await fetch('/api/image/webp-to-avif', {  // ← Change this
  method: 'POST',
  body: formData,
});

// Keep all other logic exactly the same
```

### Step 6: Update File Extension Logic
```javascript
// Update filename replacement pattern
const filename = file.name.replace(/\.webp$/i, '.avif');  // ← Change this

// For batch conversion
const filename = file.name.replace(/\.webp$/i, '.avif');  // ← Change this
```

### Step 7: Update Layout Props
```javascript
<Layout 
  title="Convert WEBP to AVIF Online for Free"  // ← Change this
  description="Convert WEBP images to AVIF format instantly. High-quality conversion with customizable quality settings. Free, fast, and secure."  // ← Change this
  keywords="WEBP to AVIF, convert WEBP, WEBP converter, image converter, free converter"  // ← Change this
>
```

### Step 8: Update Page Theme Class
```javascript
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-cyan">  // ← Change this
```

### Step 9: Update Content (Keep Structure)
```javascript
// Update tool badge
<div className="inline-flex items-center space-x-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
  <Image className="w-4 h-4" />
  <span>Image Conversion Tool</span>
</div>

// Update heading
<h1 className="heading-1 mb-6">
  Convert WEBP to AVIF Online for Free  // ← Change this
</h1>

// Update description
<p className="text-large mb-8">
  Transform your WEBP images to next-generation AVIF format instantly.  // ← Change this
  High-quality conversion with customizable quality settings. 
  No registration required, completely free.
</p>
```

### Step 10: Update File Uploader Props
```javascript
<FileUploader
  onFilesSelected={handleFileSelect}
  acceptedFileTypes={['image/webp']}  // ← Change this
  maxFiles={conversionMode === 'batch' ? 20 : 1}
  maxSize={50 * 1024 * 1024}
  multiple={conversionMode === 'batch'}
/>
```

### Step 11: Update Convert Button
```javascript
<button
  onClick={handleConvert}
  disabled={!selectedFiles || selectedFiles.length === 0 || isConverting}
  className="convert-button-cyan w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"  // ← Change this
>
  {isConverting ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Converting...</span>
    </>
  ) : (
    <>
      <Download className="w-5 h-5" />
      <span>Convert to AVIF</span>  // ← Change this
    </>
  )}
</button>
```

### Step 12: Update Features Section Content
```javascript
<h2 className="heading-2 mb-4">Why Choose Our WEBP to AVIF Converter?</h2>  // ← Change this
<p className="text-large">
  Experience the best WEBP to AVIF conversion with our advanced features.  // ← Change this
</p>
```

### Step 13: Update SEO Content
```javascript
<h2 className="heading-2 mb-6">Complete Guide to Converting WEBP to AVIF</h2>  // ← Change this

<p className="text-body mb-6">
  WEBP is a modern image format developed by Google that offers superior compression  // ← Change this
  compared to traditional formats like JPG and PNG. However, AVIF provides even better 
  compression and quality, making it the future of web images.
</p>
```

### Step 14: Update FAQ Content
```javascript
// Update all FAQ questions and answers to match the conversion type
<h3 className="heading-4 mb-3">Is WEBP to AVIF conversion free?</h3>  // ← Change this
<p className="text-body">
  Yes, our WEBP to AVIF converter is completely free to use with no hidden costs,  // ← Change this
  watermarks, or limitations. You can convert unlimited files without registration.
</p>
```

### Step 15: Update Export Statement
```javascript
export default WebpToAvifPage;  // ← Change this
```

## 🎨 Color Theme Mapping

| Page Type | Theme Class | Button Class | Badge Colors |
|-----------|-------------|--------------|--------------|
| AVIF to JPG | `page-theme-blue` | `convert-button-blue` | `bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300` |
| AVIF to PNG | `page-theme-green` | `convert-button-green` | `bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300` |
| AVIF to WEBP | `page-theme-red` | `convert-button-red` | `bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300` |
| JPG to AVIF | `page-theme-orange` | `convert-button-orange` | `bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300` |
| PNG to AVIF | `page-theme-purple` | `convert-button-purple` | `bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300` |
| WEBP to AVIF | `page-theme-cyan` | `convert-button-cyan` | `bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300` |

## 📁 Required Files to Create

### 1. Frontend Page
- `pages/image-tools/[converter-name].js`

### 2. API Endpoint
- `pages/api/image/[converter-name].js`

## 🔧 API Endpoint Template

```javascript
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
      .avif({ quality: 80 })  // ← Change this based on target format
      .toBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'image/avif');  // ← Change this
    res.setHeader('Content-Disposition', 'attachment; filename="converted.avif"');  // ← Change this
    
    res.send(processedBuffer);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
}
```

## ✅ Quality Settings by Format

| Format | Quality Range | Default | Notes |
|--------|---------------|---------|-------|
| JPG | 10-100% | 90% | Lossy compression |
| PNG | N/A | N/A | Lossless, no quality slider |
| WEBP | 10-100% | 80% | Lossy compression |
| AVIF | 10-100% | 80% | Lossy compression |

## 🚨 Critical Rules

1. **NEVER** create custom components
2. **ALWAYS** use the exact same import structure
3. **ALWAYS** use the same state management pattern
4. **ALWAYS** use the same file handling logic
5. **ALWAYS** use the same CSS class structure
6. **ALWAYS** test the page after creation
7. **ALWAYS** check for linter errors

## 🧪 Testing Checklist

- [ ] Page loads without errors
- [ ] File upload works
- [ ] Conversion works
- [ ] Download works
- [ ] Batch conversion works
- [ ] ZIP download works
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] No linter errors
- [ ] Toast notifications work

## 📝 Quick Reference

**Template File:** `pages/image-tools/avif-to-jpg.js`
**Components Used:** `Layout`, `FileUploader`, `ConvertButton`, `DownloadButton`
**Libraries:** `react-hot-toast`, `jszip`, `lucide-react`
**CSS Classes:** `glass-morphism-box`, `page-theme-[color]`, `convert-button-[color]`

---

**Remember:** Consistency is key! Follow this template exactly for all future converter pages.
