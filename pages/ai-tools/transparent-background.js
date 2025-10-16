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
  Sparkles,
  Eye,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const TransparentBackgroundPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMode, setProcessingMode] = useState('single'); // 'single' or 'batch'
  const [transparencyLevel, setTransparencyLevel] = useState(100); // 0-100

  const handleFileSelect = (files) => {
    if (files) {
      const fileArray = Array.isArray(files) ? files : [files];
      setSelectedFiles(fileArray);
      setProcessedFiles([]);
    } else {
      setSelectedFiles([]);
      setProcessedFiles([]);
    }
  };

  const handleProcess = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select files first');
      return;
    }

    setIsProcessing(true);
    setProcessedFiles([]);
    
    try {
      if (processingMode === 'single' || selectedFiles.length === 1) {
        // Single file processing
        const file = selectedFiles[0];
        const formData = new FormData();
        formData.append('file', file.file);
        formData.append('transparencyLevel', transparencyLevel);

        const response = await fetch('/api/ai/transparent-background', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Transparency processing failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = file.name.replace(/\.(jpg|jpeg|png|webp|bmp|tiff|tif)$/i, '_transparent.png');
        
        setProcessedFiles([{
          url,
          filename,
          size: blob.size,
          originalName: file.name
        }]);

        toast.success('Background made transparent successfully!');
      } else {
        // Batch processing
        const processedResults = [];
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles) {
          try {
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('transparencyLevel', transparencyLevel);

            const response = await fetch('/api/ai/transparent-background', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const filename = file.name.replace(/\.(jpg|jpeg|png|webp|bmp|tiff|tif)$/i, '_transparent.png');
              
              processedResults.push({
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
            console.error(`Transparency processing failed for ${file.name}:`, error);
            errorCount++;
          }
        }

        setProcessedFiles(processedResults);

        if (successCount > 0) {
          toast.success(`${successCount} images processed successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
        } else {
          toast.error('All processing failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Transparency processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
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
    if (processedFiles.length === 0) return;

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const filePromises = processedFiles.map(async (file) => {
        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(file.filename, blob);
      });

      await Promise.all(filePromises);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = 'imageoptimizer.transparent-backgrounds.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(zipUrl);
      
      toast.success('ZIP file downloaded successfully!');
    } catch (error) {
      console.error('ZIP creation error:', error);
      toast.error('Failed to create ZIP file. Please try again.');
    }
  };

  return (
    <Layout 
      title="Transparent Background - Make Backgrounds Transparent with AI"
      description="Make image backgrounds transparent using AI technology. Convert any image to PNG with transparent background. Free, fast, and accurate."
      keywords="transparent background, make background transparent, AI background removal, PNG transparent, free background removal"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-purple">
        {/* Hero Section with Upload */}
        <section className="section-padding bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900/20">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Side - Content */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Tool</span>
                  </div>
                  
                  <h1 className="heading-1 mb-6">
                    Make Background{' '}
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                      Transparent
                    </span>
                    {' '}with AI
                  </h1>
                  
                  <p className="text-large mb-8">
                    Transform any image into a PNG with transparent background using advanced AI technology. 
                    Perfect for logos, product photos, and graphics. No manual selection required.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600 dark:text-gray-400 mb-8">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-purple-500" />
                      <span>Transparent PNG</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span>100% Secure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>Instant Results</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Upload Interface */}
                <div className="glass-morphism-box no-shine rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <h2 className="heading-3 mb-2">Upload Your Images</h2>
                    <p className="text-gray-600 dark:text-gray-400">AI will make backgrounds transparent automatically</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="segmented-control">
                      <label className="segmented-option">
                        <input
                          type="radio"
                          name="processingMode"
                          value="single"
                          checked={processingMode === 'single'}
                          onChange={(e) => setProcessingMode(e.target.value)}
                        />
                        <div className="segmented-button">Single</div>
                      </label>
                      <label className="segmented-option">
                        <input
                          type="radio"
                          name="processingMode"
                          value="batch"
                          checked={processingMode === 'batch'}
                          onChange={(e) => setProcessingMode(e.target.value)}
                        />
                        <div className="segmented-button">Batch</div>
                      </label>
                    </div>
                  </div>
                  
                  <FileUploader
                    onFilesSelected={handleFileSelect}
                    acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff', 'image/tif']}
                    maxFiles={processingMode === 'batch' ? 10 : 1}
                    maxSize={50 * 1024 * 1024}
                    multiple={processingMode === 'batch'}
                  />
                  
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''} Ready for Processing
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

                  {/* Transparency Level Settings */}
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Transparency Level: {transparencyLevel}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={transparencyLevel}
                        onChange={(e) => setTransparencyLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Solid Background</span>
                        <span>Fully Transparent</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {transparencyLevel === 100 ? 'Background will be completely transparent' : 
                         transparencyLevel === 0 ? 'Background will remain solid' : 
                         `Background will be ${transparencyLevel}% transparent`}
                      </p>
                    </div>
                  )}

                  {/* Process Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleProcess}
                      disabled={!selectedFiles || selectedFiles.length === 0 || isProcessing}
                      className="convert-button-purple w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>AI Processing...</span>
                        </>
                      ) : (
                        <>
                          <Layers className="w-5 h-5" />
                          <span>Make Transparent</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Download Results */}
                  {processedFiles && processedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {processedFiles.length} Image{processedFiles.length > 1 ? 's' : ''} Processed Successfully!
                          </span>
                        </div>
                        {processedFiles.length > 1 && (
                          <button
                            onClick={handleDownloadAll}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Download ZIP
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {processedFiles.map((file, index) => (
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
                <h2 className="heading-2 mb-4">Why Choose Our Transparent Background Tool?</h2>
                <p className="text-large">
                  Experience the power of AI for perfect background transparency.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">AI-Powered</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Advanced AI automatically detects and removes backgrounds with precision.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Layers className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Perfect Transparency</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Get clean, professional PNG files with perfect transparency.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Eye className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">High Accuracy</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Achieve professional results with precise edge detection and object recognition.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Upload className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Batch Processing</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Process up to 10 images simultaneously with our batch processing feature.
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
              <h2 className="heading-2 mb-6">Complete Guide to Making Backgrounds Transparent</h2>
              
              <p className="text-body mb-6">
                Creating transparent backgrounds is essential for modern web design, graphic design, 
                and digital marketing. Our AI-powered tool makes this process effortless, automatically 
                detecting subjects and creating perfect transparent PNG files.
              </p>

              <h3 className="heading-3 mb-4">What is a Transparent Background?</h3>
              <p className="text-body mb-6">
                A transparent background allows the image to blend seamlessly with any background color 
                or pattern. This is achieved by using the PNG format's alpha channel, which stores 
                transparency information for each pixel.
              </p>

              <h3 className="heading-3 mb-4">How Our AI Transparency Tool Works</h3>
              <p className="text-body mb-6">
                Our tool uses advanced machine learning models to automatically identify the main subject 
                in your image and separate it from the background. The AI analyzes pixel patterns, colors, 
                and edges to create precise masks for perfect transparency.
              </p>

              <h3 className="heading-3 mb-4">Transparency Levels Explained</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>100% Transparent:</strong> Complete background removal for PNG files</li>
                <li><strong>75% Transparent:</strong> Semi-transparent background for subtle effects</li>
                <li><strong>50% Transparent:</strong> Half-transparent for overlay effects</li>
                <li><strong>25% Transparent:</strong> Mostly solid with slight transparency</li>
                <li><strong>0% Transparent:</strong> Solid background (no transparency)</li>
              </ul>

              <h3 className="heading-3 mb-4">Best Use Cases for Transparent Backgrounds</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Logos:</strong> Perfect for brand logos on any background</li>
                <li><strong>Product Photos:</strong> E-commerce product images with clean backgrounds</li>
                <li><strong>Social Media:</strong> Profile pictures and graphics for social platforms</li>
                <li><strong>Web Design:</strong> Icons, buttons, and decorative elements</li>
                <li><strong>Print Design:</strong> Graphics for business cards, flyers, and brochures</li>
              </ul>

              <h3 className="heading-3 mb-4">Tips for Best Results</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Use high-contrast images for better subject detection</li>
                <li>Ensure clear separation between subject and background</li>
                <li>Choose images with distinct foreground elements</li>
                <li>Test different transparency levels for your specific use case</li>
                <li>Always preview results before finalizing</li>
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
                  <h3 className="heading-4 mb-3">Is making backgrounds transparent free?</h3>
                  <p className="text-body">
                    Yes, our transparent background tool is completely free to use with no hidden costs, 
                    watermarks, or limitations. You can process unlimited images without registration.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What image formats support transparency?</h3>
                  <p className="text-body">
                    PNG format supports full transparency with alpha channels. Our tool converts all 
                    input formats (JPG, WebP, BMP, TIFF) to PNG with transparent backgrounds.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">How accurate is the AI transparency detection?</h3>
                  <p className="text-body">
                    Our AI achieves 95%+ accuracy on most images, with excellent results on portraits, 
                    products, and objects with clear edges. Complex images may require manual touch-ups.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Can I adjust the transparency level?</h3>
                  <p className="text-body">
                    Yes! Our tool allows you to adjust transparency from 0% (solid) to 100% (fully transparent), 
                    giving you complete control over the final result.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Are my images secure during processing?</h3>
                  <p className="text-body">
                    Absolutely. All uploaded images are automatically deleted from our servers 
                    within 24 hours. We use enterprise-grade encryption and never store your data.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What's the maximum file size I can process?</h3>
                  <p className="text-body">
                    You can process images up to 50MB in size. For larger files, consider 
                    compressing them first or contact our support team for assistance.
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

export default TransparentBackgroundPage;
