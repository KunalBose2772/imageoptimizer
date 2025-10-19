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
  Settings,
  Crop
} from 'lucide-react';
import toast from 'react-hot-toast';

const ImageCropperPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMode, setConversionMode] = useState('single'); // 'single' or 'batch'
  const [cropMode, setCropMode] = useState('free'); // 'free', 'square', 'custom'
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
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

    if (cropMode === 'custom' && (!customWidth || !customHeight || customWidth <= 0 || customHeight <= 0)) {
      toast.error('Please enter valid width and height');
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
          cropMode: cropMode,
          customWidth: cropMode === 'custom' ? parseInt(customWidth) : undefined,
          customHeight: cropMode === 'custom' ? parseInt(customHeight) : undefined,
          maintainAspectRatio: maintainAspectRatio
        };
        
        console.log('Sending request:', { 
          cropMode, 
          customWidth, 
          customHeight, 
          maintainAspectRatio,
          fileSize: base64File.length 
        });

        const response = await fetch('/api/image/image-cropper', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Crop failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = file.name.replace(/\.[^/.]+$/, '_cropped.jpg');
        
        setConvertedFiles([{
          url,
          filename,
          size: blob.size,
          originalName: file.name
        }]);

        toast.success('Image cropped successfully!');
      } else {
        // Batch conversion
        const convertedResults = [];
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles) {
          try {
            const base64File = await fileToBase64(file.file);

            const response = await fetch('/api/image/image-cropper', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                file: base64File,
                cropMode: cropMode,
                customWidth: cropMode === 'custom' ? parseInt(customWidth) : undefined,
                customHeight: cropMode === 'custom' ? parseInt(customHeight) : undefined,
                maintainAspectRatio: maintainAspectRatio
              }),
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const filename = file.name.replace(/\.[^/.]+$/, '_cropped.jpg');
              
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
          toast.success(`${successCount} images cropped successfully!`);
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} images failed to crop`);
        }
      }
    } catch (error) {
      console.error('Crop error:', error);
      toast.error('Failed to crop image. Please try again.');
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
      // Create a ZIP file with all cropped images
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
      link.download = 'cropped_images.zip';
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
      title="Crop Images Online for Free - ImageOptimizer"
      description="Crop images to specific dimensions or shapes instantly. Free online image cropper with multiple crop modes. No registration required."
      keywords="crop image, image cropper, crop photos, image editing, free cropper, online crop tool"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-teal">
        {/* Hero Section with Upload */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Side - Content */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center space-x-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Image className="w-4 h-4" />
                    <span>Image Editing Tool</span>
                  </div>
                  
                  <h1 className="heading-1 mb-6">
                    Crop{' '}
                    <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                      Images Online
                    </span>
                    {' '}for Free
                  </h1>
                  
                  <p className="text-large mb-8">
                    Crop your images to specific dimensions or shapes instantly. 
                    Free online image cropper with multiple crop modes and precise controls. 
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
                    <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-teal-500" />
                        <span className="font-medium text-teal-700 dark:text-teal-300">
                          {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''} Ready for Cropping
                        </span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-teal-600 dark:text-teal-400 truncate">
                              {file.name}
                            </span>
                            <span className="text-teal-500 dark:text-teal-400 ml-2">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Crop Settings */}
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Crop Settings</h3>
                      
                      {/* Crop Mode Selection */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Crop Mode
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setCropMode('free')}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              cropMode === 'free'
                                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Free Crop
                          </button>
                          <button
                            onClick={() => setCropMode('square')}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              cropMode === 'square'
                                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Square
                          </button>
                          <button
                            onClick={() => setCropMode('custom')}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                              cropMode === 'custom'
                                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Custom Size
                          </button>
                        </div>
                      </div>

                      {/* Input Fields */}
                      {cropMode === 'custom' && (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Width (px)
                            </label>
                            <input
                              type="number"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
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
                              value={customHeight}
                              onChange={(e) => setCustomHeight(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Height"
                              min="1"
                            />
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Crop Instructions</h4>
                            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                              <li>• <strong>Free Crop:</strong> Crop to any aspect ratio you want</li>
                              <li>• <strong>Square:</strong> Crop to a perfect square (1:1 ratio)</li>
                              <li>• <strong>Custom Size:</strong> Crop to specific dimensions</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Convert Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleConvert}
                      disabled={!selectedFiles || selectedFiles.length === 0 || isConverting}
                      className="convert-button-teal w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                      {isConverting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Cropping...</span>
                        </>
                      ) : (
                        <>
                          <Crop className="w-5 h-5" />
                          <span>Crop Images</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Download Results */}
                  {convertedFiles && convertedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-teal-500" />
                          <span className="font-medium text-teal-700 dark:text-teal-300">
                            {convertedFiles.length} File{convertedFiles.length > 1 ? 's' : ''} Cropped Successfully!
                          </span>
                        </div>
                        {convertedFiles.length > 1 && (
                          <button
                            onClick={handleDownloadAll}
                            className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors"
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
                              className="ml-3 px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors"
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
              <h2 className="heading-2 mb-4">Why Choose Our Image Cropper?</h2>
              <p className="text-large mb-12">
                Experience the best image cropping with our advanced features.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="heading-4 mb-3">Lightning Fast</h3>
                  <p className="text-body">
                    Crop images in seconds with our optimized processing engine.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="heading-4 mb-3">100% Secure</h3>
                  <p className="text-body">
                    Your images are processed securely and deleted after 24 hours.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="heading-4 mb-3">Multiple Modes</h3>
                  <p className="text-body">
                    Free crop, square crop, or custom dimensions to suit your needs.
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
              <h2 className="heading-2 mb-6">Complete Guide to Image Cropping</h2>

              <p className="text-body mb-6">
                Image cropping is an essential editing technique that allows you to remove unwanted parts of an image, 
                change the composition, or focus on specific elements. Our online image cropper provides professional-grade 
                cropping capabilities with multiple modes to suit different needs.
              </p>

              <h3 className="heading-3 mb-4">Understanding Image Cropping</h3>
              <p className="text-body mb-6">
                Image cropping involves selecting a rectangular area of an image and removing everything outside that area. 
                This technique is used for various purposes:
              </p>

              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Composition improvement:</strong> Remove distracting elements from the edges</li>
                <li><strong>Aspect ratio adjustment:</strong> Change the image proportions for specific uses</li>
                <li><strong>Focus enhancement:</strong> Draw attention to the main subject</li>
                <li><strong>Size optimization:</strong> Reduce file size by removing unnecessary areas</li>
              </ul>

              <h3 className="heading-3 mb-4">Crop Modes Explained</h3>
              <p className="text-body mb-6">
                Our image cropper offers three different modes to suit various cropping needs:
              </p>

              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Free Crop:</strong> Crop to any aspect ratio you want, giving you complete control</li>
                <li><strong>Square Crop:</strong> Crop to a perfect 1:1 square ratio, ideal for profile pictures and social media</li>
                <li><strong>Custom Size:</strong> Crop to specific pixel dimensions for precise requirements</li>
              </ul>

              <h3 className="heading-3 mb-4">Frequently Asked Questions</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="heading-4 mb-3">Is image cropping free?</h4>
                  <p className="text-body">
                    Yes, our image cropper is completely free to use with no hidden costs, watermarks, or limitations. 
                    You can crop unlimited images without registration.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">What image formats are supported?</h4>
                  <p className="text-body">
                    We support all major image formats including JPG, PNG, WebP, AVIF, BMP, and TIFF. 
                    You can crop images in any of these formats.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">Can I crop multiple images at once?</h4>
                  <p className="text-body">
                    Yes, you can upload and crop up to 20 images simultaneously. All images will be processed 
                    with the same crop settings and you can download them as a ZIP file.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">Will cropping affect image quality?</h4>
                  <p className="text-body">
                    Our cropping algorithm is optimized to maintain the best possible quality. The quality 
                    depends on the original image resolution and how much you crop.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">What's the difference between crop modes?</h4>
                  <p className="text-body">
                    Free crop lets you choose any aspect ratio, square crop creates perfect squares, 
                    and custom size allows you to specify exact pixel dimensions.
                  </p>
                </div>

                <div>
                  <h4 className="heading-4 mb-3">What's the maximum image size I can crop?</h4>
                  <p className="text-body">
                    You can crop images up to 50MB in size. There's no limit on the output dimensions, 
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

export default ImageCropperPage;