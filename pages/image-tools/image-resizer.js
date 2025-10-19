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
  Upload,
  RotateCcw,
  Maximize2,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const ImageResizerPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMode, setConversionMode] = useState('single'); // 'single' or 'batch'
  const [resizeMode, setResizeMode] = useState('percentage'); // 'percentage', 'width', 'height', 'dimensions', 'fit'
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleFileSelect = (files) => {
    if (files) {
      // Handle both single file (object) and multiple files (array)
      const fileArray = Array.isArray(files) ? files : [files];
      setSelectedFiles(fileArray);
      setConvertedFiles([]);
    } else {
      setSelectedFiles([]);
      setConvertedFiles([]);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleConvert = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select files first');
      return;
    }

    if (resizeMode === 'dimensions' && (!width || !height || width <= 0 || height <= 0)) {
      toast.error('Please enter valid width and height');
      return;
    }

    if (resizeMode === 'width' && (!width || width <= 0)) {
      toast.error('Please enter a valid width');
      return;
    }

    if (resizeMode === 'height' && (!height || height <= 0)) {
      toast.error('Please enter a valid height');
      return;
    }

    if (resizeMode === 'percentage' && (!percentage || percentage <= 0 || percentage > 500)) {
      toast.error('Please enter a valid percentage (1-500)');
      return;
    }

    if (resizeMode === 'fit' && (!width || !height || width <= 0 || height <= 0)) {
      toast.error('Please enter valid fit dimensions');
      return;
    }

    setIsConverting(true);
    setConvertedFiles([]);
    
    try {
      if (conversionMode === 'single' || selectedFiles.length === 1) {
        // Single file conversion
        const file = selectedFiles[0];
        const base64File = await fileToBase64(file.file);

        const requestData = { 
          file: base64File,
          resizeMode: resizeMode,
          width: resizeMode === 'dimensions' || resizeMode === 'fit' || resizeMode === 'width' ? parseInt(width) : undefined,
          height: resizeMode === 'dimensions' || resizeMode === 'fit' || resizeMode === 'height' ? parseInt(height) : undefined,
          percentage: resizeMode === 'percentage' ? parseInt(percentage) : undefined,
          maintainAspectRatio: maintainAspectRatio
        };
        
        console.log('Sending request:', { 
          resizeMode, 
          width, 
          height, 
          percentage, 
          maintainAspectRatio,
          fileSize: base64File.length 
        });

        const response = await fetch('/api/image/image-resizer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Resize failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = file.name.replace(/\.[^/.]+$/, '_resized.jpg');
        
        setConvertedFiles([{
          url,
          filename,
          size: blob.size,
          originalName: file.name
        }]);

        toast.success('Image resized successfully!');
      } else {
        // Batch conversion
        const convertedResults = [];
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles) {
          try {
            const base64File = await fileToBase64(file.file);

            const response = await fetch('/api/image/image-resizer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                file: base64File,
                resizeMode: resizeMode,
                width: resizeMode === 'dimensions' || resizeMode === 'fit' || resizeMode === 'width' ? parseInt(width) : undefined,
                height: resizeMode === 'dimensions' || resizeMode === 'fit' || resizeMode === 'height' ? parseInt(height) : undefined,
                percentage: resizeMode === 'percentage' ? parseInt(percentage) : undefined,
                maintainAspectRatio: maintainAspectRatio
              }),
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const filename = file.name.replace(/\.[^/.]+$/, '_resized.jpg');
              
              convertedResults.push({
                url,
                filename,
                size: blob.size,
                originalName: file.name
              });
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            errorCount++;
          }
        }

        setConvertedFiles(convertedResults);
        
        if (successCount > 0) {
          toast.success(`${successCount} images resized successfully!`);
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} images failed to resize`);
        }
      }
    } catch (error) {
      console.error('Resize error:', error);
      toast.error('Failed to resize image. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (file) => {
    if (file) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadAll = async () => {
    if (convertedFiles.length === 0) return;

    try {
      // Create a ZIP file with all resized images
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add each converted file to the ZIP
      const filePromises = convertedFiles.map(async (file) => {
        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(file.filename, blob);
      });

      // Wait for all files to be added
      await Promise.all(filePromises);

      // Generate and download the ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = 'resized_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(zipUrl);
      
      toast.success('ZIP file downloaded successfully!');
    } catch (error) {
      console.error('ZIP creation error:', error);
      toast.error('Failed to create ZIP file. Please try again.');
    }
  };

  return (
    <Layout 
      title="Resize Images Online for Free - ImageOptimizer"
      description="Resize images to specific dimensions or percentages instantly. High-quality image resizing with customizable settings. Free, fast, and secure."
      keywords="resize image, image resizer, resize photos, image dimensions, aspect ratio, free image resizer"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-emerald">
        {/* Hero Section with Upload */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Side - Content */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Image className="w-4 h-4" />
                    <span>Image Editing Tool</span>
                  </div>
                  
                  <h1 className="heading-1 mb-6">
                    Resize{' '}
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                      Images Online
                    </span>
                    {' '}for Free
                  </h1>
                  
                  <p className="text-large mb-8">
                    Resize your images to specific dimensions or percentages instantly. 
                    High-quality resizing with customizable settings and aspect ratio preservation. 
                    No registration required, completely free.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600 dark:text-gray-400 mb-8">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-primary-500" />
                      <span>Lightning Fast</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span>100% Secure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>Processed in Seconds</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Upload Interface */}
                <div className="glass-morphism-box no-shine rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <h2 className="heading-3 mb-2">Upload Your Images</h2>
                    <p className="text-gray-600 dark:text-gray-400">Drag & drop or click to browse</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="segmented-control">
                      <label className="segmented-option">
                        <input
                          type="radio"
                          name="conversionMode"
                          value="single"
                          checked={conversionMode === 'single'}
                          onChange={(e) => setConversionMode(e.target.value)}
                        />
                        <div className="segmented-button">Single</div>
                      </label>
                      <label className="segmented-option">
                        <input
                          type="radio"
                          name="conversionMode"
                          value="batch"
                          checked={conversionMode === 'batch'}
                          onChange={(e) => setConversionMode(e.target.value)}
                        />
                        <div className="segmented-button">Batch</div>
                      </label>
                    </div>
                  </div>
                  
                  <FileUploader
                    onFilesSelected={handleFileSelect}
                    acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/bmp', 'image/tiff']}
                    maxFiles={conversionMode === 'batch' ? 20 : 1}
                    maxSize={50 * 1024 * 1024}
                    multiple={conversionMode === 'batch'}
                  />
                  
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">
                          {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''} Ready for Resizing
                        </span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 truncate">
                              {file.name}
                            </span>
                            <span className="text-emerald-500 dark:text-emerald-400 ml-2">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resize Settings */}
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Resize Settings</h3>
                      
                      {/* Resize Mode Selection */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Resize Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setResizeMode('percentage')}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              resizeMode === 'percentage'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Percentage
                          </button>
                          <button
                            onClick={() => setResizeMode('width')}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              resizeMode === 'width'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            By Width
                          </button>
                          <button
                            onClick={() => setResizeMode('height')}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              resizeMode === 'height'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            By Height
                          </button>
                          <button
                            onClick={() => setResizeMode('dimensions')}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              resizeMode === 'dimensions'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Exact Size
                          </button>
                        </div>
                      </div>

                      {/* Input Fields */}
                      {resizeMode === 'dimensions' && (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Width (px)
                            </label>
                            <input
                              type="number"
                              value={width}
                              onChange={(e) => setWidth(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Width"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Height (px)
                            </label>
                            <input
                              type="number"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Height"
                              min="1"
                            />
                          </div>
                        </div>
                      )}

                      {resizeMode === 'width' && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Width (px) - Height will be calculated automatically
                          </label>
                          <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter width"
                            min="1"
                          />
                        </div>
                      )}

                      {resizeMode === 'height' && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Height (px) - Width will be calculated automatically
                          </label>
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter height"
                            min="1"
                          />
                        </div>
                      )}

                      {/* Percentage Input */}
                      {resizeMode === 'percentage' && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Resize Percentage: {percentage}%
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="500"
                            value={percentage}
                            onChange={(e) => setPercentage(parseInt(e.target.value))}
                            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-emerald"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>1%</span>
                            <span>500%</span>
                          </div>
                        </div>
                      )}

                      {/* Aspect Ratio Toggle */}
                      {resizeMode === 'dimensions' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="maintainAspectRatio"
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            className="w-3 h-3 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="maintainAspectRatio" className="text-xs text-gray-600 dark:text-gray-400">
                            Maintain aspect ratio
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Convert Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleConvert}
                      disabled={!selectedFiles || selectedFiles.length === 0 || isConverting}
                      className="convert-button-emerald w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                      {isConverting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Resizing...</span>
                        </>
                      ) : (
                        <>
                          <Image className="w-5 h-5" />
                          <span>Resize Images</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Download Results */}
                  {convertedFiles && convertedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="font-medium text-emerald-700 dark:text-emerald-300">
                            {convertedFiles.length} File{convertedFiles.length > 1 ? 's' : ''} Resized Successfully!
                          </span>
                        </div>
                        {convertedFiles.length > 1 && (
                          <button
                            onClick={handleDownloadAll}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Download ZIP
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {convertedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {file.filename}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <button
                              onClick={() => handleDownload(file)}
                              className="ml-3 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="heading-2 mb-4">Why Choose Our Image Resizer?</h2>
              <p className="text-large mb-12">
                Experience the best image resizing with our advanced features.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="heading-4 mb-3">Lightning Fast</h3>
                  <p className="text-body">
                    Resize images in seconds with our optimized processing engine.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="heading-4 mb-3">100% Secure</h3>
                  <p className="text-body">
                    Your images are processed securely and deleted after 24 hours.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="heading-4 mb-3">Flexible Options</h3>
                  <p className="text-body">
                    Resize by dimensions, percentage, or fit to specific sizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto prose prose-lg max-w-none dark:prose-invert">
              <h2 className="heading-2 mb-6">Complete Guide to Image Resizing</h2>

              <p className="text-body mb-6">
                Image resizing is one of the most common image editing tasks, whether you're preparing photos for web use, 
                social media, or print. Our online image resizer provides professional-grade resizing capabilities with 
                multiple options to suit your specific needs.
              </p>

              <h3 className="heading-3 mb-4">Understanding Image Resizing</h3>
              <p className="text-body mb-6">
                Image resizing involves changing the dimensions of an image while maintaining or adjusting its aspect ratio. 
                There are several approaches to resizing images, each with its own advantages:
              </p>

              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Dimension-based resizing:</strong> Specify exact width and height in pixels</li>
                <li><strong>Percentage resizing:</strong> Scale images by a percentage of their original size</li>
                <li><strong>Fit-to-size resizing:</strong> Resize images to fit within specific dimensions while maintaining aspect ratio</li>
              </ul>

              <h3 className="heading-3 mb-4">When to Resize Images</h3>
              <p className="text-body mb-6">
                Image resizing is essential for various purposes:
              </p>

              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Web optimization:</strong> Reduce file sizes for faster loading times</li>
                <li><strong>Social media:</strong> Meet platform-specific dimension requirements</li>
                <li><strong>Email attachments:</strong> Reduce file sizes for easier sharing</li>
                <li><strong>Print preparation:</strong> Resize images to specific print dimensions</li>
                <li><strong>Thumbnail creation:</strong> Generate smaller versions for galleries</li>
              </ul>

              <h3 className="heading-3 mb-4">Frequently Asked Questions</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="heading-4 mb-3">Is image resizing free?</h4>
                  <p className="text-body">
                    Yes, our image resizer is completely free to use with no hidden costs, watermarks, or limitations. 
                    You can resize unlimited images without registration.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">What image formats are supported?</h4>
                  <p className="text-body">
                    We support all major image formats including JPG, PNG, WebP, AVIF, BMP, and TIFF. 
                    You can resize images in any of these formats.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">Can I resize multiple images at once?</h4>
                  <p className="text-body">
                    Yes, you can upload and resize up to 20 images simultaneously. All images will be processed 
                    with the same settings and you can download them as a ZIP file.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">Will resizing affect image quality?</h4>
                  <p className="text-body">
                    Our resizing algorithm is optimized to maintain the best possible quality. However, 
                    enlarging images significantly may result in some quality loss, while reducing size 
                    generally improves quality.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">How do I maintain aspect ratio?</h4>
                  <p className="text-body">
                    When using dimension-based resizing, check the "Maintain aspect ratio" option. 
                    This will automatically calculate the appropriate height or width to preserve 
                    the original proportions.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">What's the maximum image size I can resize?</h4>
                  <p className="text-body">
                    You can resize images up to 50MB in size. There's no limit on the output dimensions, 
                    but very large images may take longer to process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ImageResizerPage;