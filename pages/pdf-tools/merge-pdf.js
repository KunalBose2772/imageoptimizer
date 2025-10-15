import React, { useState } from 'react';
import Layout from '../../components/Layout';
import FileUploader from '../../components/FileUploader';
import { ProcessButton, DownloadButton } from '../../components/ActionButton';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Info, 
  Zap,
  Shield,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  GripVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const MergePdfPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mergedFile, setMergedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelect = (files) => {
    if (files) {
      setSelectedFiles(files);
      setMergedFile(null);
    }
  };

  const moveFile = (index, direction) => {
    const newFiles = [...selectedFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setSelectedFiles(newFiles);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      toast.error('Please select at least 2 PDF files');
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      
      // Add files in the order they appear in the list
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file.file);
      });
      formData.append('fileCount', selectedFiles.length.toString());

      const response = await fetch('/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Merge failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = `merged_document_${Date.now()}.pdf`;
      
      setMergedFile({
        url,
        filename,
        size: blob.size
      });

      toast.success('PDFs merged successfully!');
    } catch (error) {
      console.error('Merge error:', error);
      toast.error('Merge failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedFile) {
      const link = document.createElement('a');
      link.href = mergedFile.url;
      link.download = mergedFile.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Layout 
      title="Merge PDF Files Online for Free - Combine Multiple PDFs"
      description="Merge multiple PDF files into one document instantly. Drag and drop reordering, high-quality output, completely free and secure."
      keywords="merge PDF, combine PDF, PDF merger, free PDF tools, PDF combiner"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 page-theme-purple">
        {/* Hero Section with Upload */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container-custom">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Content */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <FileText className="w-4 h-4" />
                    <span>PDF Tools</span>
                  </div>
                  
                  <h1 className="heading-1 mb-6">
                    Merge PDF Files Online for Free
                  </h1>
                  
                  <p className="text-large mb-8">
                    Combine multiple PDF documents into one file instantly. 
                    Drag and drop reordering, high-quality output, and completely secure. 
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
                    <h2 className="heading-3 mb-2">Upload PDF Files</h2>
                    <p className="text-gray-600 dark:text-gray-400">Drag & drop or click to browse</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="segmented-control">
                      <label className="segmented-option">
                        <input
                          type="radio"
                          name="mergeMode"
                          value="merge"
                          checked={true}
                          onChange={() => {}}
                        />
                        <div className="segmented-button">Merge PDFs</div>
                      </label>
                      <label className="segmented-option">
                        <input
                          type="radio"
                          name="mergeMode"
                          value="split"
                          checked={false}
                          onChange={() => {}}
                        />
                        <div className="segmented-button">Split PDFs</div>
                      </label>
                    </div>
                  </div>

                  <FileUploader
                    onFilesSelected={handleFilesSelect}
                    acceptedFileTypes={['application/pdf']}
                    maxFiles={10}
                    maxSize={50 * 1024 * 1024}
                    multiple={true}
                  />
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {selectedFiles.length} PDF file{selectedFiles.length > 1 ? 's' : ''} ready for merging
                        </span>
                      </div>
                    </div>
                  )}

                  {/* File Ordering */}
                  {selectedFiles.length > 1 && (
                    <div className="mt-6">
                      <h3 className="heading-4 mb-4">Arrange File Order</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Drag files or use arrows to reorder. Files will be merged in this sequence.
                      </p>
                      
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => moveFile(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveFile(index, 'down')}
                                disabled={index === selectedFiles.length - 1}
                                className="p-1 text-gray-400 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeFile(index)}
                                className="p-1 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Merge Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleMerge}
                      disabled={selectedFiles.length < 2 || isProcessing}
                      className="convert-button-purple w-full py-3 px-6 rounded-xl font-semibold disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Merging...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          <span>Merge PDFs</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Download Results */}
                  {mergedFile && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-300">
                          Merge Complete!
                        </span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                        {mergedFile.filename} ({(mergedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      
                      <DownloadButton
                        onClick={handleDownload}
                        filename={mergedFile.filename}
                      />
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
                <h2 className="heading-2 mb-4">Why Choose Our PDF Merger?</h2>
                <p className="text-large">
                  Experience the best PDF merging with our advanced features and security.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-morphism-box rounded-2xl p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                    <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="heading-4 mb-4 group-hover:text-primary-500 transition-colors duration-300">Lightning Fast</h3>
                  <p className="text-body group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Merge multiple PDF files in seconds with our optimized processing engine.
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
                    Maintain document quality and formatting with our advanced merging algorithms.
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
              <h2 className="heading-2 mb-6">Complete Guide to Merging PDF Files</h2>
              
              <p className="text-body mb-6">
                Merging PDF files is essential for combining multiple documents into a single, 
                organized file. Whether you're consolidating reports, combining contracts, 
                or organizing research materials, our PDF merger makes the process simple and efficient.
              </p>

              <h3 className="heading-3 mb-4">What is PDF Merging?</h3>
              <p className="text-body mb-6">
                PDF merging combines multiple PDF documents into a single file while preserving 
                the original formatting, fonts, images, and layout of each document. The merged 
                file maintains the page order and quality of the original documents.
              </p>

              <h3 className="heading-3 mb-4">Common Use Cases</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li><strong>Business Reports:</strong> Combine quarterly reports, financial statements, and presentations</li>
                <li><strong>Legal Documents:</strong> Merge contracts, agreements, and supporting documents</li>
                <li><strong>Academic Papers:</strong> Combine research papers, references, and appendices</li>
                <li><strong>Project Documentation:</strong> Organize project plans, specifications, and deliverables</li>
                <li><strong>Personal Documents:</strong> Combine receipts, invoices, and important papers</li>
              </ul>

              <h3 className="heading-3 mb-4">How Our PDF Merger Works</h3>
              <p className="text-body mb-6">
                Our merger uses advanced PyMuPDF (fitz) library to ensure high-quality merging:
              </p>
              <ol className="list-decimal pl-6 mb-6 text-body">
                <li>Upload multiple PDF files (up to 10 files, 50MB each)</li>
                <li>Arrange files in your preferred order using drag-and-drop</li>
                <li>Click merge to combine all documents</li>
                <li>Download your merged PDF file instantly</li>
              </ol>

              <h3 className="heading-3 mb-4">Best Practices for PDF Merging</h3>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Ensure all PDFs are properly formatted before merging</li>
                <li>Check file sizes to stay within the 50MB limit per file</li>
                <li>Use descriptive names for your merged files</li>
                <li>Verify the order of documents before merging</li>
                <li>Keep original files as backup copies</li>
              </ul>

              <h3 className="heading-3 mb-4">File Size Optimization</h3>
              <p className="text-body mb-6">
                If your merged file is too large, consider:
              </p>
              <ul className="list-disc pl-6 mb-6 text-body">
                <li>Using our PDF compression tool before merging</li>
                <li>Converting images to lower resolution</li>
                <li>Removing unnecessary pages or sections</li>
                <li>Using our PDF optimization features</li>
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
                  <h3 className="heading-4 mb-3">How many PDF files can I merge at once?</h3>
                  <p className="text-body">
                    You can merge up to 10 PDF files at once, with each file being up to 50MB in size. 
                    For larger batches, you can use our API or contact us for enterprise solutions.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Will the merged PDF maintain original quality?</h3>
                  <p className="text-body">
                    Yes, our merger preserves the original quality, formatting, fonts, and layout 
                    of all documents. The merged file will look exactly like the original documents combined.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Can I reorder pages after merging?</h3>
                  <p className="text-body">
                    You can reorder the files before merging using our drag-and-drop interface. 
                    For page-level reordering, use our PDF page organizer tool.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Is PDF merging free?</h3>
                  <p className="text-body">
                    Yes, our PDF merger is completely free to use with no hidden costs, 
                    watermarks, or limitations. No registration required.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">Are my files secure during merging?</h3>
                  <p className="text-body">
                    Absolutely. All uploaded files are automatically deleted from our servers 
                    within 24 hours. We use enterprise-grade encryption and never store your data.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="heading-4 mb-3">What if merging fails?</h3>
                  <p className="text-body">
                    If merging fails, check that all files are valid PDFs and not corrupted. 
                    Try reducing file sizes or merging fewer files at once. Contact support if issues persist.
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

export default MergePdfPage;
