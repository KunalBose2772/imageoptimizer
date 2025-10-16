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
  Wand2,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const RemoveBackgroundPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMode, setProcessingMode] = useState('single'); // 'single' or 'batch'
  const [backgroundType, setBackgroundType] = useState('transparent'); // 'transparent' or 'solid'
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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
        formData.append('backgroundType', backgroundType);
        formData.append('backgroundColor', backgroundColor);

        const response = await fetch('/api/ai/remove-background', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Background removal failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = file.name.replace(/\.(jpg|jpeg|png|webp|bmp|tiff|tif)$/i, '_no_bg.png');
        
        setProcessedFiles([{
          url,
          filename,
          size: blob.size,
          originalName: file.name
        }]);

        toast.success('Background removed successfully!');
      } else {
        // Batch processing
        const processedResults = [];
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles) {
          try {
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('backgroundType', backgroundType);
            formData.append('backgroundColor', backgroundColor);

            const response = await fetch('/api/ai/remove-background', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const filename = file.name.replace(/\.(jpg|jpeg|png|webp|bmp|tiff|tif)$/i, '_no_bg.png');
              
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
            console.error(`Background removal failed for ${file.name}:`, error);
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
      toast.error('Background removal failed. Please try again.');
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
      link.download = 'imageoptimizer.ai-background-removed.zip';
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
      title="AI Background Remover - Remove Backgrounds Instantly"
      description="Remove backgrounds from images using AI technology. Instant PNG with transparent background. Free, fast, and accurate background removal."
      keywords="AI background remover, remove background, transparent background, AI image editing, free background removal"
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
                    AI Background{' '}
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                      Remover
                    </span>
                    {' '}- Instant PNG
                  </h1>
                  
                  <p className="text-large mb-8">
                    Remove backgrounds from any image using advanced AI technology. 
                    Get professional results with transparent PNGs in seconds. 
                    No manual editing required.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600 dark:text-gray-400 mb-8">
                    <div className="flex items-center space-x-2">
                      <Wand2 className="w-5 h-5 text-purple-500" />
                      <span>AI-Powered</span>
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
                    <p className="text-gray-600 dark:text-gray-400">AI will automatically detect and remove backgrounds</p>
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
                          {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''} Ready for AI Processing
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

                  {/* Background Options */}
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Background Type
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="backgroundType"
                              value="transparent"
                              checked={backgroundType === 'transparent'}
                              onChange={(e) => setBackgroundType(e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">Transparent (PNG)</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="backgroundType"
                              value="solid"
                              checked={backgroundType === 'solid'}
                              onChange={(e) => setBackgroundType(e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">Solid Color</span>
                          </label>
                        </div>
                      </div>

                      {backgroundType === 'solid' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Color
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      )}
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
                          <Wand2 className="w-5 h-5" />
                          <span>Remove Background</span>
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
                <h2 className="heading-2 mb-4">Why Choose Our AI Background Remover?</h2>
                <p className="text-large">
                  Experience the power of artificial intelligence for perfect background removal.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">AI-Powered</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Advanced machine learning algorithms automatically detect and remove backgrounds with precision.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Lightning Fast</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Get results in seconds with our optimized AI processing engine.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Eye className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">High Accuracy</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Achieve professional-quality results with precise edge detection and object recognition.
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
              <h2 className="heading-2 mb-6">Complete Guide to AI Background Removal</h2>
              
              <p className="text-body mb-6">
                AI background removal has revolutionized image editing, making it possible to remove backgrounds 
                from photos instantly without manual selection or complex editing tools. Our advanced AI technology 
                uses deep learning models to automatically detect subjects and create perfect cutouts.
              </p>

              <h3 className="heading-3 mb-4">How AI Background Removal Works</h3>
              <p className="text-body mb-6">
                Our AI background remover uses state-of-the-art machine learning models trained on millions of images. 
                The process involves semantic segmentation, where the AI identifies different parts of the image and 
                determines which pixels belong to the foreground subject versus the background.
              </p>

              <h3 className="heading-3 mb-4">Key Features of Our AI Tool</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Automatic Detection:</strong> AI automatically identifies subjects without manual input</li>
                <li><strong>Edge Precision:</strong> Maintains sharp, clean edges around complex objects</li>
                <li><strong>Hair & Fur Detail:</strong> Preserves fine details like hair strands and fur</li>
                <li><strong>Transparency Support:</strong> Outputs PNG with perfect transparency</li>
                <li><strong>Batch Processing:</strong> Handle multiple images simultaneously</li>
              </ul>

              <h3 className="heading-3 mb-4">Best Practices for AI Background Removal</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Use high-contrast images for better subject detection</li>
                <li>Ensure good lighting and clear subject separation</li>
                <li>Choose images with distinct foreground and background</li>
                <li>For complex images, consider pre-processing for better results</li>
                <li>Always preview results before finalizing</li>
              </ul>

              <h3 className="heading-3 mb-4">Use Cases for Background Removal</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>E-commerce:</strong> Product photos with clean backgrounds</li>
                <li><strong>Marketing:</strong> Social media graphics and advertisements</li>
                <li><strong>Portraits:</strong> Professional headshots and profile photos</li>
                <li><strong>Design:</strong> Creating composite images and collages</li>
                <li><strong>Presentations:</strong> Clean visuals for business materials</li>
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
                  <h3 className="heading-4 mb-3">Is AI background removal free?</h3>
                  <p className="text-body">
                    Yes, our AI background remover is completely free to use with no hidden costs, 
                    watermarks, or limitations. You can process unlimited images without registration.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What image formats are supported?</h3>
                  <p className="text-body">
                    We support JPG, PNG, WebP, BMP, and TIFF input formats. All processed images 
                    are output as PNG files with transparency support.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">How accurate is the AI background removal?</h3>
                  <p className="text-body">
                    Our AI achieves 95%+ accuracy on most images, with excellent results on portraits, 
                    products, and objects with clear edges. Complex images with similar foreground/background 
                    colors may require manual touch-ups.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Can I process multiple images at once?</h3>
                  <p className="text-body">
                    Yes! Our batch processing feature allows you to upload and process up to 10 images 
                    simultaneously. Each image is processed individually to ensure optimal quality.
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

export default RemoveBackgroundPage;
