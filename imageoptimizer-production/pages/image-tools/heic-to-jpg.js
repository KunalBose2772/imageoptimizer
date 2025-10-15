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
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

const HeicToJpgPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(90);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setConvertedFile(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsConverting(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile.file);
      formData.append('quality', quality);

      const response = await fetch('/api/image/heic-to-jpg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = selectedFile.name.replace(/\.(heic|heif)$/i, '.jpg');
      
      setConvertedFile({
        url,
        filename,
        size: blob.size
      });

      toast.success('Conversion completed successfully!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile.url;
      link.download = convertedFile.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Layout 
      title="HEIC/HEIF to JPG Converter - Convert iPhone Photos Online"
      description="Convert HEIC and HEIF images from iPhone to JPG format instantly. High-quality conversion with customizable settings. Free, fast, and secure."
      keywords="HEIC to JPG, HEIF to JPG, iPhone photo converter, HEIC converter, free converter"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Smartphone className="w-4 h-4" />
                <span>iPhone Photo Converter</span>
              </div>
              
              <h1 className="heading-1 mb-6">
                HEIC/HEIF to JPG Converter
              </h1>
              
              <p className="text-large mb-8">
                Convert your iPhone HEIC and HEIF photos to universal JPG format instantly. 
                Perfect for sharing photos across all devices and platforms. 
                No registration required, completely free.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-400">
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
          </div>
        </section>

        {/* Conversion Tool */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="heading-3 mb-4">Upload HEIC/HEIF File</h2>
                    
                    <FileUploader
                      onFilesSelected={handleFileSelect}
                      acceptedFileTypes={['image/heic', 'image/heif']}
                      maxFiles={1}
                      maxSize={50 * 1024 * 1024}
                    />
                    
                    {selectedFile && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            File Ready for Conversion
                          </span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quality Settings */}
                  {selectedFile && (
                    <div className="card p-6">
                      <h3 className="heading-4 mb-4">Quality Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            JPEG Quality: {quality}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>Lower Size</span>
                            <span>Higher Quality</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversion Section */}
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="heading-3 mb-4">Convert to JPG</h2>
                    
                    <div className="space-y-4">
                      <ConvertButton
                        onClick={handleConvert}
                        loading={isConverting}
                        disabled={!selectedFile}
                        outputFormat="JPG"
                      />
                      
                      {convertedFile && (
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-green-700 dark:text-green-300">
                              Conversion Complete!
                            </span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                            {convertedFile.filename} ({(convertedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                          
                          <DownloadButton
                            onClick={handleDownload}
                            filename={convertedFile.filename}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  {convertedFile && (
                    <div className="card p-6">
                      <h3 className="heading-4 mb-4">Preview</h3>
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={convertedFile.url}
                          alt="Converted JPG"
                          className="w-full h-full object-contain"
                        />
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
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="heading-2 mb-4">Why Convert HEIC to JPG?</h2>
                <p className="text-large">
                  HEIC (High Efficiency Image Container) is Apple's modern image format, 
                  but JPG offers universal compatibility.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-4 mb-4">iPhone Compatible</h3>
                  <p className="text-body">
                    Perfect for converting photos from iPhone and iPad devices that use HEIC format.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-4 mb-4">Universal Support</h3>
                  <p className="text-body">
                    JPG format works on all devices, browsers, and social media platforms worldwide.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-4 mb-4">High Quality</h3>
                  <p className="text-body">
                    Maintain excellent image quality with our advanced conversion algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
              <h2 className="heading-2 mb-6">Complete Guide to Converting HEIC to JPG</h2>
              
              <p className="text-body mb-6">
                HEIC (High Efficiency Image Container) is Apple's modern image format introduced with iOS 11. 
                While it offers superior compression and quality compared to JPEG, it's not universally supported 
                across all devices and platforms, making JPG conversion essential for broader compatibility.
              </p>

              <h3 className="heading-3 mb-4">What is HEIC Format?</h3>
              <p className="text-body mb-6">
                HEIC is based on the HEVC (H.265) video codec and provides up to 50% better compression 
                than JPEG while maintaining similar or better image quality. It supports advanced features 
                like transparency, HDR, and live photos, but has limited compatibility outside the Apple ecosystem.
              </p>

              <h3 className="heading-3 mb-4">Why Convert HEIC to JPG?</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Universal Compatibility:</strong> JPG works on all devices and platforms</li>
                <li><strong>Web Compatibility:</strong> All browsers and websites support JPG</li>
                <li><strong>Social Media:</strong> Most platforms prefer JPG format for uploads</li>
                <li><strong>Email Sharing:</strong> JPG files are smaller and more compatible for email</li>
                <li><strong>Print Services:</strong> Better support for professional printing</li>
              </ul>

              <h3 className="heading-3 mb-4">iPhone HEIC Settings</h3>
              <p className="text-body mb-6">
                If you want to avoid HEIC conversion in the future, you can change your iPhone settings:
              </p>
              <ol className="list-decimal pl-6 mb-6 text-body">
                <li>Go to Settings &gt; Camera &gt; Formats</li>
                <li>Select "Most Compatible" instead of "High Efficiency"</li>
                <li>Your iPhone will now capture photos in JPG format</li>
              </ol>

              <h3 className="heading-3 mb-4">Quality Settings Guide</h3>
              <p className="text-body mb-6">
                Our HEIC to JPG converter offers quality settings from 10% to 100%:
              </p>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>95-100%:</strong> Maximum quality, best for professional use</li>
                <li><strong>85-94%:</strong> High quality, good for social media and printing</li>
                <li><strong>70-84%:</strong> Good quality, balanced size and quality</li>
                <li><strong>50-69%:</strong> Moderate compression, suitable for web use</li>
                <li><strong>10-49%:</strong> High compression, smallest file sizes</li>
              </ul>

              <h3 className="heading-3 mb-4">Batch Conversion Tips</h3>
              <p className="text-body mb-6">
                For converting multiple HEIC files:
              </p>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Use our API for bulk conversion</li>
                <li>Consider using desktop software for large batches</li>
                <li>Compress images before conversion to save space</li>
                <li>Keep original HEIC files as backup</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-2 text-center mb-12">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What is the difference between HEIC and JPG?</h3>
                  <p className="text-body">
                    HEIC is Apple's modern image format that offers better compression and quality than JPG. 
                    However, JPG has universal compatibility across all devices and platforms, while HEIC 
                    is mainly supported by Apple devices.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">How do I get HEIC files from my iPhone?</h3>
                  <p className="text-body">
                    HEIC files are automatically created when you take photos with an iPhone using iOS 11 or later. 
                    You can transfer them via AirDrop, iCloud, or by connecting your iPhone to a computer.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Will converting HEIC to JPG reduce quality?</h3>
                  <p className="text-body">
                    Our converter uses high-quality algorithms to minimize quality loss. With 90-100% quality 
                    settings, the difference is virtually imperceptible while ensuring universal compatibility.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Can I convert HEIC files on Android?</h3>
                  <p className="text-body">
                    Yes! Our online HEIC to JPG converter works on all devices, including Android phones, 
                    tablets, and computers. No app installation required.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Is there a file size limit?</h3>
                  <p className="text-body">
                    You can convert HEIC files up to 50MB in size. For larger files, consider compressing 
                    them first or contact our support team for assistance.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Are my photos safe during conversion?</h3>
                  <p className="text-body">
                    Absolutely. All uploaded files are automatically deleted from our servers within 24 hours. 
                    We use enterprise-grade security and never store or share your photos.
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

export default HeicToJpgPage;
