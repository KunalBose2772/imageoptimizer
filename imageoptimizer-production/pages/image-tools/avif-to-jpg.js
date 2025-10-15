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
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const AvifToJpgPage = () => {
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

      const response = await fetch('/api/image/avif-to-jpg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = selectedFile.name.replace(/\.(avif|heif)$/i, '.jpg');
      
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
      title="Convert AVIF to JPG Online for Free"
      description="Convert AVIF images to JPG format instantly. High-quality conversion with customizable quality settings. Free, fast, and secure."
      keywords="AVIF to JPG, convert AVIF, AVIF converter, image converter, free converter"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Image className="w-4 h-4" />
                <span>Image Conversion Tool</span>
              </div>
              
              <h1 className="heading-1 mb-6">
                Convert AVIF to JPG Online for Free
              </h1>
              
              <p className="text-large mb-8">
                Transform your AVIF images to universal JPG format instantly. 
                High-quality conversion with customizable quality settings. 
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
                    <h2 className="heading-3 mb-4">Upload AVIF File</h2>
                    
                    <FileUploader
                      onFilesSelected={handleFileSelect}
                      acceptedFileTypes={['image/avif', 'image/heif']}
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
                <h2 className="heading-2 mb-4">Why Choose Our AVIF to JPG Converter?</h2>
                <p className="text-large">
                  Experience the best AVIF to JPG conversion with our advanced features.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-4 mb-4">Lightning Fast</h3>
                  <p className="text-body">
                    Convert your AVIF files to JPG in seconds with our optimized processing engine.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-4 mb-4">100% Secure</h3>
                  <p className="text-body">
                    Your files are automatically deleted after 24 hours. No storage, no tracking.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-4 mb-4">High Quality</h3>
                  <p className="text-body">
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
            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
              <h2 className="heading-2 mb-6">Complete Guide to Converting AVIF to JPG</h2>
              
              <p className="text-body mb-6">
                AVIF (AV1 Image File Format) is a modern image format that offers superior compression 
                compared to traditional formats like JPG and PNG. However, not all devices and applications 
                support AVIF files, making JPG conversion essential for broader compatibility.
              </p>

              <h3 className="heading-3 mb-4">What is AVIF Format?</h3>
              <p className="text-body mb-6">
                AVIF is based on the AV1 video codec and provides excellent compression efficiency. 
                It can reduce file sizes by up to 50% compared to JPEG while maintaining similar visual quality. 
                However, browser support for AVIF is still limited, making JPG conversion necessary for 
                universal compatibility.
              </p>

              <h3 className="heading-3 mb-4">Why Convert AVIF to JPG?</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Universal Compatibility:</strong> JPG is supported by all devices and browsers</li>
                <li><strong>Wide Application Support:</strong> Works with all image editing software</li>
                <li><strong>Social Media Ready:</strong> Most platforms prefer JPG format</li>
                <li><strong>Print Friendly:</strong> Better support for printing and professional use</li>
              </ul>

              <h3 className="heading-3 mb-4">How Our AVIF to JPG Converter Works</h3>
              <p className="text-body mb-6">
                Our converter uses advanced Sharp and Pillow libraries to ensure high-quality conversion. 
                The process involves decoding the AVIF file, applying quality optimization, and encoding 
                to JPG format while preserving maximum visual fidelity.
              </p>

              <h3 className="heading-3 mb-4">Quality Settings Explained</h3>
              <p className="text-body mb-6">
                Our tool offers customizable quality settings from 10% to 100%:
              </p>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>90-100%:</strong> Highest quality, larger file size</li>
                <li><strong>70-89%:</strong> Good balance of quality and size</li>
                <li><strong>50-69%:</strong> Moderate compression, smaller files</li>
                <li><strong>10-49%:</strong> High compression, smallest files</li>
              </ul>

              <h3 className="heading-3 mb-4">Best Practices</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Use 85-95% quality for professional images</li>
                <li>Use 70-80% quality for web images</li>
                <li>Use 50-70% quality for thumbnails and previews</li>
                <li>Always keep original files as backup</li>
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
                  <h3 className="heading-4 mb-3">Is AVIF to JPG conversion free?</h3>
                  <p className="text-body">
                    Yes, our AVIF to JPG converter is completely free to use with no hidden costs, 
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
                    Most AVIF to JPG conversions complete in under 3 seconds. Processing time 
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
                    Currently, our converter processes one file at a time to ensure optimal quality. 
                    For batch conversion, you can use our API or contact us for enterprise solutions.
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

export default AvifToJpgPage;
