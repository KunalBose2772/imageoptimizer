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
  Maximize,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const AiUpscalePage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMode, setProcessingMode] = useState('single'); // 'single' or 'batch'
  const [upscaleFactor, setUpscaleFactor] = useState('2x'); // '2x', '4x', '8x'

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
        formData.append('upscaleFactor', upscaleFactor);

        const response = await fetch('/api/ai/ai-upscale', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('AI upscaling failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const factor = upscaleFactor.replace('x', '');
        const filename = file.name.replace(/\.(jpg|jpeg|png|webp|bmp|tiff|tif)$/i, `_${factor}x_upscaled.png`);
        
        setProcessedFiles([{
          url,
          filename,
          size: blob.size,
          originalName: file.name,
          upscaleFactor
        }]);

        toast.success('Image upscaled successfully!');
      } else {
        // Batch processing
        const processedResults = [];
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles) {
          try {
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('upscaleFactor', upscaleFactor);

            const response = await fetch('/api/ai/ai-upscale', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const factor = upscaleFactor.replace('x', '');
              const filename = file.name.replace(/\.(jpg|jpeg|png|webp|bmp|tiff|tif)$/i, `_${factor}x_upscaled.png`);
              
              processedResults.push({
                url,
                filename,
                size: blob.size,
                originalName: file.name,
                upscaleFactor
              });
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            console.error(`AI upscaling failed for ${file.name}:`, error);
            errorCount++;
          }
        }

        setProcessedFiles(processedResults);

        if (successCount > 0) {
          toast.success(`${successCount} images upscaled successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
        } else {
          toast.error('All processing failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('AI upscaling failed. Please try again.');
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
      link.download = 'imageoptimizer.ai-upscaled.zip';
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

  const getUpscaleInfo = (factor) => {
    const info = {
      '2x': { pixels: '4x', description: 'Double resolution (2x2 = 4x pixels)' },
      '4x': { pixels: '16x', description: 'Quadruple resolution (4x4 = 16x pixels)' },
      '8x': { pixels: '64x', description: '8x resolution (8x8 = 64x pixels)' }
    };
    return info[factor] || info['2x'];
  };

  return (
    <Layout 
      title="AI Image Upscaler - Enhance Image Quality with AI"
      description="Upscale images using AI technology. 2x, 4x, 8x upscaling with enhanced details and sharpness. Free AI-powered image enhancement."
      keywords="AI image upscaler, image enhancement, AI upscale, super resolution, image quality improvement, free upscaler"
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
                    <span>AI-Powered Enhancement</span>
                  </div>
                  
                  <h1 className="heading-1 mb-6">
                    AI Image{' '}
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                      Upscaler
                    </span>
                    {' '}(2x, 4x, 8x)
                  </h1>
                  
                  <p className="text-large mb-8">
                    Enhance your images with AI-powered upscaling. Increase resolution by 2x, 4x, or 8x 
                    while adding realistic details and improving sharpness. Perfect for enlarging photos 
                    without losing quality.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600 dark:text-gray-400 mb-8">
                    <div className="flex items-center space-x-2">
                      <Maximize className="w-5 h-5 text-purple-500" />
                      <span>Up to 8x Resolution</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span>100% Secure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>AI Processing</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Upload Interface */}
                <div className="glass-morphism-box no-shine rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <h2 className="heading-3 mb-2">Upload Your Images</h2>
                    <p className="text-gray-600 dark:text-gray-400">AI will enhance and upscale your images</p>
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
                    maxFiles={processingMode === 'batch' ? 5 : 1}
                    maxSize={50 * 1024 * 1024}
                    multiple={processingMode === 'batch'}
                  />
                  
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''} Ready for AI Enhancement
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

                  {/* Upscale Factor Selection */}
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Upscale Factor
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['2x', '4x', '8x'].map((factor) => {
                          const info = getUpscaleInfo(factor);
                          return (
                            <label key={factor} className="relative">
                              <input
                                type="radio"
                                name="upscaleFactor"
                                value={factor}
                                checked={upscaleFactor === factor}
                                onChange={(e) => setUpscaleFactor(e.target.value)}
                                className="sr-only"
                              />
                              <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                upscaleFactor === factor
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}>
                                <div className="text-center">
                                  <div className={`text-2xl font-bold mb-1 ${
                                    upscaleFactor === factor ? 'text-purple-600' : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {factor}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {info.pixels} pixels
                                  </div>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        {getUpscaleInfo(upscaleFactor).description}
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
                          <Maximize className="w-5 h-5" />
                          <span>Upscale Image{selectedFiles.length > 1 ? 's' : ''}</span>
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
                            {processedFiles.length} Image{processedFiles.length > 1 ? 's' : ''} Enhanced Successfully!
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
                                {file.upscaleFactor} upscaled • {(file.size / 1024 / 1024).toFixed(2)} MB
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
                <h2 className="heading-2 mb-4">Why Choose Our AI Image Upscaler?</h2>
                <p className="text-large">
                  Experience the power of artificial intelligence for superior image enhancement.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">AI-Powered</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Advanced neural networks generate realistic details and enhance image quality.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Maximize className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Multiple Scales</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Choose from 2x, 4x, or 8x upscaling to meet your specific resolution needs.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Eye className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Enhanced Details</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    AI adds realistic textures, sharpens edges, and improves overall image clarity.
                  </p>
                </div>
                
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Upload className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Batch Processing</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Process up to 5 images simultaneously with our batch processing feature.
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
              <h2 className="heading-2 mb-6">Complete Guide to AI Image Upscaling</h2>
              
              <p className="text-body mb-6">
                AI image upscaling uses deep learning algorithms to increase image resolution while 
                adding realistic details and improving overall quality. Unlike traditional upscaling 
                methods that simply stretch pixels, AI upscaling generates new, contextually appropriate 
                details based on patterns learned from millions of images.
              </p>

              <h3 className="heading-3 mb-4">How AI Upscaling Works</h3>
              <p className="text-body mb-6">
                Our AI upscaler uses advanced neural networks trained on high-resolution image datasets. 
                The AI analyzes the input image, identifies patterns, textures, and structures, then 
                generates new pixels that maintain the original image's characteristics while adding 
                realistic details and improving sharpness.
              </p>

              <h3 className="heading-3 mb-4">Upscaling Factors Explained</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>2x Upscaling:</strong> Doubles both width and height (4x total pixels) - Perfect for general enhancement</li>
                <li><strong>4x Upscaling:</strong> Quadruples both dimensions (16x total pixels) - Ideal for significant size increases</li>
                <li><strong>8x Upscaling:</strong> Increases by 8x in each dimension (64x total pixels) - Maximum enhancement for very small images</li>
              </ul>

              <h3 className="heading-3 mb-4">Best Use Cases for AI Upscaling</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Old Photos:</strong> Enhance vintage or low-resolution family photos</li>
                <li><strong>Digital Art:</strong> Upscale artwork and digital paintings</li>
                <li><strong>Product Images:</strong> Improve e-commerce product photos</li>
                <li><strong>Social Media:</strong> Enhance images for high-resolution displays</li>
                <li><strong>Print Materials:</strong> Prepare images for large-format printing</li>
              </ul>

              <h3 className="heading-3 mb-4">Tips for Best Results</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Start with the highest quality source image available</li>
                <li>Use 2x for most general purposes</li>
                <li>Use 4x for significant size increases</li>
                <li>Use 8x only for very small images that need maximum enhancement</li>
                <li>Consider the final use case when choosing upscale factor</li>
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
                  <h3 className="heading-4 mb-3">Is AI image upscaling free?</h3>
                  <p className="text-body">
                    Yes, our AI image upscaler is completely free to use with no hidden costs, 
                    watermarks, or limitations. You can upscale unlimited images without registration.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What's the difference between AI upscaling and regular resizing?</h3>
                  <p className="text-body">
                    Regular resizing simply stretches pixels, often resulting in blurry images. 
                    AI upscaling uses machine learning to generate new, realistic details and 
                    textures, maintaining image quality and sharpness.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Which upscale factor should I choose?</h3>
                  <p className="text-body">
                    Choose 2x for general enhancement, 4x for significant size increases, 
                    and 8x for very small images that need maximum enhancement. Consider 
                    your final use case and the original image size.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">How long does AI upscaling take?</h3>
                  <p className="text-body">
                    Processing time depends on the original image size and upscale factor. 
                    Most images process in 30-60 seconds, with larger images and higher 
                    upscale factors taking longer.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Can I upscale multiple images at once?</h3>
                  <p className="text-body">
                    Yes! Our batch processing feature allows you to upload and upscale up to 5 images 
                    simultaneously. Each image is processed individually to ensure optimal quality.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What's the maximum file size I can upscale?</h3>
                  <p className="text-body">
                    You can upscale images up to 50MB in size. For larger files, consider 
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

export default AiUpscalePage;
