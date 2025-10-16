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

### Step 1: Copy Base Template (CRITICAL - DO NOT SKIP)
**ALWAYS start by copying the base template file using terminal command:**

```bash
# Copy the base template file
copy pages\image-tools\avif-to-jpg.js pages\image-tools\[new-converter-name].js

# Example:
copy pages\image-tools\avif-to-jpg.js pages\image-tools\heif-to-jpg.js
```

**⚠️ NEVER create from scratch - ALWAYS copy the working template first!**

### Step 2: Update Component Name and Function (EXACT REPLACEMENTS ONLY)
**Replace these EXACT strings:**

```javascript
// Replace this:
const AvifToJpgPage = () => {

// With this:
const [NewConverterName]Page = () => {

// Example:
const HeifToJpgPage = () => {
```

### Step 3: Update API Endpoints (EXACT REPLACEMENTS ONLY)
**Replace these EXACT strings:**

```javascript
// Replace this:
const response = await fetch('/api/image/avif-to-jpg', {

// With this (replace ALL occurrences):
const response = await fetch('/api/image/[new-converter-name]', {

// Example:
const response = await fetch('/api/image/heif-to-jpg', {
```

### Step 4: Update File Extensions (EXACT REPLACEMENTS ONLY)
**Replace these EXACT strings:**

```javascript
// Replace this:
const filename = file.name.replace(/\.(avif|heif)$/i, '.jpg');

// With this (replace ALL occurrences):
const filename = file.name.replace(/\.([new-input-format]|[alternative-format])$/i, '.[output-format]');

// Example:
const filename = file.name.replace(/\.(heif|heic)$/i, '.jpg');
```

### Step 5: Update Layout Props (EXACT REPLACEMENTS ONLY)
**Replace these EXACT strings:**

```javascript
// Replace this:
title="Convert AVIF to JPG Online for Free"
description="Convert AVIF images to JPG format instantly. High-quality conversion with customizable quality settings. Free, fast, and secure."
keywords="AVIF to JPG, convert AVIF, AVIF converter, image converter, free converter"

// With this:
title="Convert [INPUT] to [OUTPUT] Online for Free"
description="Convert [INPUT] images to [OUTPUT] format instantly. High-quality conversion with customizable quality settings. Free, fast, and secure."
keywords="[INPUT] to [OUTPUT], convert [INPUT], [INPUT] converter, image converter, free converter"
```

### Step 6: Update Theme Class (EXACT REPLACEMENTS ONLY)
**Replace this EXACT string:**

```javascript
// Replace this:
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-blue">

// With this:
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-[color]">
```

### Step 6.5: Update Badge Colors (EXACT REPLACEMENTS ONLY)
**Replace this EXACT string:**

```javascript
// Replace this:
<div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">

// With this:
<div className="inline-flex items-center space-x-2 bg-[color]-100 dark:bg-[color]-900/30 text-[color]-700 dark:text-[color]-300 px-4 py-2 rounded-full text-sm font-medium mb-6">

// Example for lime theme:
<div className="inline-flex items-center space-x-2 bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
```

### Step 7: Update Main Heading with Accent Colors (EXACT REPLACEMENTS ONLY)
**Replace this EXACT string:**

```javascript
// Replace this:
<h1 className="heading-1 mb-6">
  Convert AVIF to JPG Online for Free
</h1>

// With this:
<h1 className="heading-1 mb-6">
  Convert{' '}
  <span className="bg-gradient-to-r from-[color-500] to-[color-600] bg-clip-text text-transparent">
    [INPUT] to [OUTPUT]
  </span>
  {' '}Online
</h1>

// Example:
<h1 className="heading-1 mb-6">
  Convert{' '}
  <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
    HEIF to JPG
  </span>
  {' '}Online
</h1>
```

### Step 8: Update Description Text (EXACT REPLACEMENTS ONLY)
**Replace this EXACT string:**

```javascript
// Replace this:
Transform your AVIF images to universal JPG format instantly.

// With this:
Transform your [INPUT] images to universal [OUTPUT] format instantly.
```

### Step 9: Update Upload Section (EXACT REPLACEMENTS ONLY)
**Replace these EXACT strings:**

```javascript
// Replace this:
<h2 className="heading-3 mb-2">Upload Your AVIF Files</h2>

// With this:
<h2 className="heading-3 mb-2">Upload Your [INPUT] Files</h2>

// Replace this:
acceptedFileTypes={['image/avif', 'image/heif']}

// With this:
acceptedFileTypes={['image/[input-format]', 'image/[alternative-format]']}
```

### Step 10: Update Button Class (EXACT REPLACEMENTS ONLY)
**Replace this EXACT string:**

```javascript
// Replace this:
className="convert-button-blue w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"

// With this:
className="convert-button-[color] w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
```

### Step 11: Update All Content Text (EXACT REPLACEMENTS ONLY)
**Replace ALL occurrences of:**
- `AVIF` → `[INPUT]`
- `JPG` → `[OUTPUT]`
- `avif` → `[input-format]`
- `jpg` → `[output-format]`

### Step 12: Update Export Statement (EXACT REPLACEMENTS ONLY)
**Replace this EXACT string:**

```javascript
// Replace this:
export default AvifToJpgPage;

// With this:
export default [NewConverterName]Page;
```

### Step 13: Update Imports (Keep Exactly the Same)
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

| Page Type | Theme Class | Button Class | Badge Colors | Heading Accent Colors |
|-----------|-------------|--------------|--------------|----------------------|
| AVIF to JPG | `page-theme-blue` | `convert-button-blue` | `bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300` | `from-blue-500 to-blue-600` |
| AVIF to PNG | `page-theme-green` | `convert-button-green` | `bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300` | `from-green-500 to-green-600` |
| AVIF to WEBP | `page-theme-red` | `convert-button-red` | `bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300` | `from-red-500 to-red-600` |
| JPG to AVIF | `page-theme-orange` | `convert-button-orange` | `bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300` | `from-orange-500 to-orange-600` |
| PNG to AVIF | `page-theme-purple` | `convert-button-purple` | `bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300` | `from-purple-500 to-purple-600` |
| WEBP to AVIF | `page-theme-cyan` | `convert-button-cyan` | `bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300` | `from-cyan-500 to-cyan-600` |
| HEIC to JPG | `page-theme-fuchsia` | `convert-button-fuchsia` | `bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300` | `from-fuchsia-500 to-fuchsia-600` |
| HEIC to PNG | `page-theme-emerald` | `convert-button-emerald` | `bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300` | `from-emerald-500 to-emerald-600` |
| HEIF to JPG | `page-theme-sky` | `convert-button-sky` | `bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300` | `from-sky-500 to-blue-500` |
| JPG to PNG | `page-theme-emerald` | `convert-button-emerald` | `bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300` | `from-emerald-500 to-emerald-600` |
| PNG to JPG | `page-theme-teal` | `convert-button-teal` | `bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300` | `from-teal-500 to-teal-600` |
| JPG to WebP | `page-theme-lime` | `convert-button-lime` | `bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300` | `from-lime-500 to-lime-600` |
| PNG to WebP | `page-theme-indigo` | `convert-button-indigo` | `bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300` | `from-indigo-500 to-indigo-600` |
| WebP to JPG | `page-theme-rose` | `convert-button-rose` | `bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300` | `from-rose-500 to-rose-600` |
| WebP to PNG | `page-theme-violet` | `convert-button-violet` | `bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300` | `from-violet-500 to-violet-600` |
| BMP to JPG | `page-theme-slate` | `convert-button-slate` | `bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300` | `from-slate-500 to-slate-600` |
| BMP to PNG | `page-theme-amber` | `convert-button-amber` | `bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300` | `from-amber-500 to-amber-600` |
| BMP to WebP | `page-theme-sky` | `convert-button-sky` | `bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300` | `from-sky-500 to-sky-600` |

### 🎨 Heading Accent Color Implementation
**Use this EXACT pattern for all converter headings:**

```javascript
<h1 className="heading-1 mb-6">
  Convert{' '}
  <span className="bg-gradient-to-r from-[color-500] to-[color-600] bg-clip-text text-transparent">
    [INPUT] to [OUTPUT]
  </span>
  {' '}Online for Free
</h1>
```

**Examples:**
- **Blue theme:** `from-blue-500 to-blue-600`
- **Green theme:** `from-green-500 to-green-600`
- **Sky theme:** `from-sky-500 to-blue-500`
- **Fuchsia theme:** `from-fuchsia-500 to-fuchsia-600`

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
