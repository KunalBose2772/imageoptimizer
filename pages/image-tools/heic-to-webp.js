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

const HeicToWebpPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(90);
  const [conversionMode, setConversionMode] = useState('single'); // 'single' or 'batch'

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

  const handleConvert = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select files first');
      return;
    }

    setIsConverting(true);
    setConvertedFiles([]);
    
    try {
      if (conversionMode === 'single' || selectedFiles.length === 1) {
        // Single file conversion
        const file = selectedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('quality', quality);

        const response = await fetch('/api/image/heic-to-webp', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Conversion failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const fileName = file.name.replace(/\.(heic|heif)$/i, '.webp');
        
        setConvertedFiles([{
          name: fileName,
          url: url,
          size: blob.size,
          originalName: file.name
        }]);
        
        toast.success('Conversion completed successfully!');
      } else {
        // Batch conversion
        const convertedFiles = [];
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const formData = new FormData();
          formData.append('file', file);
          formData.append('quality', quality);

          const response = await fetch('/api/image/heic-to-webp', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Conversion failed for ${file.name}`);
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const fileName = file.name.replace(/\.(heic|heif)$/i, '.webp');
          
          convertedFiles.push({
            name: fileName,
            url: url,
            size: blob.size,
            originalName: file.name
          });
        }
        
        setConvertedFiles(convertedFiles);
        toast.success(`Successfully converted ${convertedFiles.length} files!`);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (convertedFiles.length === 0) return;

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all converted files to zip
      for (const file of convertedFiles) {
        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(file.name, blob);
      }

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'imageoptimizer.in.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('All files downloaded as ZIP!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to create ZIP file');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 page-theme-lime">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-200 px-4 py-2 rounded-full text-sm font-medium">
                    <Image className="w-4 h-4" />
                    <span>Image Conversion Tool</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                    Convert{' '}
                    <span className="bg-gradient-to-r from-lime-500 to-green-500 bg-clip-text text-transparent">
                      HEIC to WEBP
                    </span>
                    {' '}Online
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Transform your HEIC images to modern WEBP format with superior compression and quality. 
                    Perfect for web optimization and faster loading times.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Lightning Fast</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Convert in seconds</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">100% Secure</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Files processed locally</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">No Registration</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Start converting now</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - File Uploader */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                  {/* Conversion Mode Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Conversion Mode
                    </label>
                    <div className="segmented-control">
                      <button
                        type="button"
                        className={`radio-option ${conversionMode === 'single' ? 'active' : ''}`}
                        onClick={() => setConversionMode('single')}
                      >
                        <span className="radio-custom"></span>
                        <span className="radio-label">Single File</span>
                      </button>
                      <button
                        type="button"
                        className={`radio-option ${conversionMode === 'batch' ? 'active' : ''}`}
                        onClick={() => setConversionMode('batch')}
                      >
                        <span className="radio-custom"></span>
                        <span className="radio-label">Batch Convert</span>
                      </button>
                    </div>
                  </div>

                  {/* Quality Slider */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Lower size</span>
                      <span>Higher quality</span>
                    </div>
                  </div>

                  {/* File Uploader */}
                  <div className="mb-6">
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      accept=".heic,.heif"
                      multiple={conversionMode === 'batch'}
                      maxFiles={conversionMode === 'batch' ? 10 : 1}
                    />
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Selected Files ({selectedFiles.length})
                      </h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Image className="w-4 h-4 text-lime-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Convert Button */}
                  <button
                    onClick={handleConvert}
                    disabled={selectedFiles.length === 0 || isConverting}
                    className="convert-button-lime w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    {isConverting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Converting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Upload className="w-5 h-5" />
                        <span>Convert to WEBP</span>
                      </div>
                    )}
                  </button>

                  {/* Converted Files */}
                  {convertedFiles.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Converted Files ({convertedFiles.length})
                        </h3>
                        {convertedFiles.length > 1 && (
                          <button
                            onClick={handleDownloadAll}
                            className="flex items-center space-x-2 text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download All</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {convertedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {file.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownload(file)}
                              className="flex items-center space-x-2 text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 text-sm font-medium"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
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
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Convert HEIC to WEBP?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                WEBP format offers superior compression and quality compared to traditional image formats, 
                making it perfect for modern web applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-lime-600 dark:text-lime-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Superior Compression
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  WEBP provides 25-35% better compression than JPEG while maintaining the same quality.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-lime-600 dark:text-lime-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Web Optimized
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Perfect for web use with faster loading times and better user experience.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-lime-600 dark:text-lime-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Modern Format
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Supported by all modern browsers and recommended by Google for web optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What is HEIC format?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  HEIC (High Efficiency Image Container) is Apple's modern image format used by default 
                  on iOS devices. It provides better compression than JPEG but has limited compatibility.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Why convert HEIC to WEBP?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  WEBP offers superior compression and quality compared to traditional formats, 
                  making it perfect for web use with faster loading times and better user experience.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Is the conversion secure?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, all conversions are processed locally in your browser. Your files are never 
                  uploaded to our servers, ensuring complete privacy and security.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What quality settings should I use?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  For web use, 80-90% quality provides excellent results. For print or archival purposes, 
                  use 95-100% quality. Lower quality settings result in smaller file sizes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HeicToWebpPage;
