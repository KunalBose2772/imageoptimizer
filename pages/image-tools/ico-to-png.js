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

const IcoToPngPage = () => {
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
        formData.append('file', file.file);
        formData.append('quality', quality);

        const response = await fetch('/api/image/ico-to-png', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Conversion failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = file.name.replace(/\.(ico)$/i, '.png');
        
        setConvertedFiles([{
          url,
          filename,
          size: blob.size,
          originalName: file.name
        }]);

        toast.success('Conversion completed successfully!');
      } else {
        // Batch conversion
        const convertedResults = [];
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles) {
          try {
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('quality', quality);

            const response = await fetch('/api/image/ico-to-png', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const filename = file.name.replace(/\.(ico)$/i, '.png');
              
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
            console.error(`Conversion failed for ${file.name}:`, error);
            errorCount++;
          }
        }

        setConvertedFiles(convertedResults);

        if (successCount > 0) {
          toast.success(`${successCount} files converted successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
        } else {
          toast.error('All conversions failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Conversion failed. Please try again.');
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
      // Create a ZIP file with all converted images
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
      link.download = 'imageoptimizer.in.zip';
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
      title="Convert ICO to PNG Online for Free"
      description="Convert ICO files to PNG format instantly. Lossless conversion with transparency support. Free, fast, and secure."
      keywords="ICO to PNG, convert ICO, ICO converter, image converter, free converter"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-fuchsia">
        {/* Hero Section with Upload */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Side - Content */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center space-x-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Image className="w-4 h-4" />
                    <span>Image Conversion Tool</span>
                  </div>
                  
                  <h1 className="heading-1 mb-6">
                    Convert{' '}
                    <span className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 bg-clip-text text-transparent">
                      ICO to PNG
                    </span>
                    {' '}Online for Free
                  </h1>
                  
                  <p className="text-large mb-8">
                    Transform your ICO files to universal PNG format instantly. 
                    Lossless conversion with transparency support. 
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
                    <h2 className="heading-3 mb-2">Upload Your ICO Files</h2>
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
                    acceptedFileTypes={['image/x-icon', 'image/vnd.microsoft.icon']}
                    maxFiles={conversionMode === 'batch' ? 20 : 1}
                    maxSize={50 * 1024 * 1024}
                    multiple={conversionMode === 'batch'}
                  />
                  
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''} Ready for Conversion
                        </span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-green-600 dark:text-green-400 truncate">
                              {file.name}
                            </span>
                            <span className="text-green-500 dark:text-green-400 ml-2">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Convert Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleConvert}
                      disabled={!selectedFiles || selectedFiles.length === 0 || isConverting}
                      className="convert-button-fuchsia w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                      {isConverting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Converting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Convert to PNG</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Download Results */}
                  {convertedFiles && convertedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {convertedFiles.length} File{convertedFiles.length > 1 ? 's' : ''} Converted Successfully!
                          </span>
                        </div>
                        {convertedFiles.length > 1 && (
                          <button
                            onClick={handleDownloadAll}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
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
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              onClick={() => handleDownload(file)}
                              className="ml-3 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded transition-colors"
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
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="heading-2 mb-4">Why Choose Our ICO to PNG Converter?</h2>
                <p className="text-large">
                  Experience the best ICO to PNG conversion with our advanced features.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Lightning Fast</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Convert your AVIF files to JPG in seconds with our optimized processing engine.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Upload className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Batch Conversion</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Convert up to 20 AVIF files simultaneously with our batch processing feature.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Shield className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">100% Secure</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Your files are automatically deleted after 24 hours. No storage, no tracking.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Star className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">High Quality</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Maintain image quality with customizable compression settings and advanced algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto prose prose-lg dark:prose-invert">
              <h2 className="heading-2 mb-6">Complete Guide to Converting ICO to PNG</h2>
              
              <p className="text-body mb-6">
                ICO (Icon) files are Windows icon format commonly used for application icons and favicons. 
                However, ICO files have limited browser support and are not ideal for modern web use, 
                making PNG conversion essential for broader compatibility and better quality.
              </p>

              <h3 className="heading-3 mb-4">What is ICO Format?</h3>
              <p className="text-body mb-6">
                ICO is a Windows icon format that can contain multiple images of different sizes (16x16, 32x32, 48x48, etc.) 
                in a single file. It's primarily used for application icons and favicons. However, ICO files have limited 
                browser support and are not ideal for modern web use, making PNG conversion necessary for universal compatibility.
              </p>

              <h3 className="heading-3 mb-4">Why Convert ICO to PNG?</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Universal Compatibility:</strong> PNG is supported by all devices and browsers</li>
                <li><strong>Lossless Quality:</strong> No quality loss during conversion</li>
                <li><strong>Transparency Support:</strong> Preserves alpha channels and transparency</li>
                <li><strong>Better Quality:</strong> PNG provides superior image quality compared to ICO</li>
              </ul>

              <h3 className="heading-3 mb-4">How Our ICO to PNG Converter Works</h3>
              <p className="text-body mb-6">
                Our converter uses advanced Sharp library to ensure high-quality conversion. 
                The process involves decoding the ICO file and encoding to PNG format while preserving 
                maximum visual fidelity and transparency. You can convert single files or 
                batch process up to 20 ICO files simultaneously for maximum efficiency.
              </p>

              <h3 className="heading-3 mb-4">Lossless Conversion</h3>
              <p className="text-body mb-6">
                PNG is a lossless format, meaning no quality is lost during conversion:
              </p>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Perfect Quality:</strong> No compression artifacts or quality loss</li>
                <li><strong>Transparency Preserved:</strong> Alpha channels and transparency maintained</li>
                <li><strong>Color Accuracy:</strong> All colors and details preserved exactly</li>
                <li><strong>Professional Grade:</strong> Suitable for professional and archival use</li>
              </ul>

              <h3 className="heading-3 mb-4">Best Practices</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Use PNG for icons with transparency or sharp edges</li>
                <li>Use PNG for logos, graphics, and line art</li>
                <li>Use PNG for images that need perfect quality preservation</li>
                <li>Consider file size for web use - PNG can be larger than JPG</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <h2 className="heading-2 text-center mb-12">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Is ICO to PNG conversion free?</h3>
                  <p className="text-body">
                    Yes, our ICO to PNG converter is completely free to use with no hidden costs, 
                    watermarks, or limitations. You can convert unlimited files without registration.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What is the maximum file size I can convert?</h3>
                  <p className="text-body">
                    You can convert AVIF files up to 50MB in size. For larger files, consider 
                    compressing them first or contact our support team for assistance.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">How long does conversion take?</h3>
                  <p className="text-body">
                    Most ICO to PNG conversions complete in under 3 seconds. Processing time 
                    depends on file size and current server load.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Are my files secure during conversion?</h3>
                  <p className="text-body">
                    Absolutely. All uploaded files are automatically deleted from our servers 
                    within 24 hours. We use enterprise-grade encryption and never store your data.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What quality setting should I use?</h3>
                  <p className="text-body">
                    For most purposes, we recommend 85-90% quality, which provides excellent 
                    visual quality with reasonable file sizes. Adjust based on your specific needs.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Can I convert multiple files at once?</h3>
                  <p className="text-body">
                    Yes! Our converter supports batch processing of up to 20 AVIF files simultaneously. 
                    Simply select "Batch" mode, upload multiple files, and convert them all at once. 
                    Each file is processed individually to ensure optimal quality.
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

export default IcoToPngPage;

