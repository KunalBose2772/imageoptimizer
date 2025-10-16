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

const HeicToPngPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
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

        const response = await fetch('/api/image/heic-to-png', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Conversion failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = file.name.replace(/\.(heic|heif)$/i, '.png');
        
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

            const response = await fetch('/api/image/heic-to-png', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const filename = file.name.replace(/\.(heic|heif)$/i, '.png');
              
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
      title="Convert HEIC to PNG Online for Free"
      description="Convert HEIC images to PNG format instantly. Lossless conversion with universal compatibility. Free, fast, and secure."
      keywords="HEIC to PNG, convert HEIC, HEIC converter, image converter, free converter"
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
                    <span>Image Conversion Tool</span>
                  </div>
                  
                  <h1 className="heading-1 mb-6">
                    Convert HEIC to PNG Online for Free
                  </h1>
                  
                  <p className="text-large mb-8">
                    Transform your HEIC images to PNG format instantly. 
                    Lossless conversion with universal compatibility. 
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
                    <h2 className="heading-3 mb-2">Upload Your HEIC Files</h2>
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
                    acceptedFileTypes={['image/heic', 'image/heif']}
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
                      className="convert-button-emerald w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
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
                <h2 className="heading-2 mb-4">Why Choose Our HEIC to PNG Converter?</h2>
                <p className="text-large">
                  Experience the best HEIC to PNG conversion with our advanced features.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Lightning Fast</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Convert your HEIC files to PNG in seconds with our optimized processing engine.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Upload className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Batch Conversion</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Convert up to 20 HEIC files simultaneously with our batch processing feature.
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
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Lossless Quality</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    PNG format preserves all image data without any quality loss or compression artifacts.
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
              <h2 className="heading-2 mb-6">Complete Guide to Converting HEIC to PNG</h2>
              
              <p className="text-body mb-6">
                HEIC (High Efficiency Image Container) is Apple's modern image format used by default 
                on iPhones and iPads. While HEIC offers excellent compression, it's not universally 
                supported. Converting HEIC to PNG ensures compatibility with all devices and platforms 
                while maintaining lossless quality.
              </p>

              <h3 className="heading-3 mb-4">What is HEIC Format?</h3>
              <p className="text-body mb-6">
                HEIC is Apple's modern image format that provides superior compression compared to JPEG. 
                It's the default format for photos taken on iPhones and iPads running iOS 11 or later. 
                While HEIC offers better quality and smaller file sizes, it's not supported by all 
                devices and applications, making PNG conversion necessary for universal compatibility.
              </p>

              <h3 className="heading-3 mb-4">Why Convert HEIC to PNG?</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Universal Compatibility:</strong> PNG is supported by all devices and platforms</li>
                <li><strong>Lossless Quality:</strong> No compression artifacts or quality loss</li>
                <li><strong>Transparency Support:</strong> Maintains alpha channels and transparency</li>
                <li><strong>Professional Use:</strong> Ideal for graphics, logos, and detailed images</li>
                <li><strong>Web Compatibility:</strong> Displays correctly on all websites and browsers</li>
              </ul>

              <h3 className="heading-3 mb-4">How Our HEIC to PNG Converter Works</h3>
              <p className="text-body mb-6">
                Our converter uses advanced Sharp and Pillow libraries to ensure high-quality conversion. 
                The process involves decoding the HEIC file and encoding to PNG format while preserving 
                all image data without any loss. You can convert single files or batch process up to 
                20 HEIC files simultaneously for maximum efficiency.
              </p>

              <h3 className="heading-3 mb-4">PNG vs Other Formats</h3>
              <p className="text-body mb-6">
                PNG is the ideal choice for HEIC conversion when you need:
              </p>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Lossless Quality:</strong> Perfect for professional images and graphics</li>
                <li><strong>Transparency:</strong> Maintains alpha channels for overlays and logos</li>
                <li><strong>Text and Graphics:</strong> Sharp edges without compression artifacts</li>
                <li><strong>Universal Support:</strong> Works on all platforms and devices</li>
              </ul>

              <h3 className="heading-3 mb-4">Best Practices</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Use PNG for graphics, logos, and images with text</li>
                <li>Use PNG when transparency is required</li>
                <li>Use PNG for professional or archival purposes</li>
                <li>Consider file size - PNG files are typically larger than JPEG</li>
                <li>Always keep original HEIC files as backup</li>
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
                  <h3 className="heading-4 mb-3">Is HEIC to PNG conversion free?</h3>
                  <p className="text-body">
                    Yes, our HEIC to PNG converter is completely free to use with no hidden costs, 
                    watermarks, or limitations. You can convert unlimited files without registration.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What is the maximum file size I can convert?</h3>
                  <p className="text-body">
                    You can convert HEIC files up to 50MB in size. For larger files, consider 
                    compressing them first or contact our support team for assistance.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">How long does conversion take?</h3>
                  <p className="text-body">
                    Most HEIC to PNG conversions complete in under 3 seconds. Processing time 
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
                  <h3 className="heading-4 mb-3">Will PNG files be larger than HEIC?</h3>
                  <p className="text-body">
                    Yes, PNG files are typically larger than HEIC files because PNG is lossless 
                    while HEIC uses lossy compression. However, PNG ensures perfect quality and 
                    universal compatibility.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Can I convert multiple files at once?</h3>
                  <p className="text-body">
                    Yes! Our converter supports batch processing of up to 20 HEIC files simultaneously. 
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

export default HeicToPngPage;


