import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  Archive, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const FileUploader = ({ 
  onFilesSelected, 
  acceptedFileTypes = [], 
  maxFiles = 1, 
  maxSize = 50 * 1024 * 1024, // 50MB default
  className = '',
  disabled = false,
  multiple = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Archive;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError('');
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setUploadError(`File size must be less than ${formatFileSize(maxSize)}`);
      } else if (error.code === 'file-invalid-type') {
        setUploadError(`File type not supported. Accepted types: ${acceptedFileTypes.join(', ')}`);
      } else {
        setUploadError(error.message);
      }
      return;
    }

    const filesWithPreview = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      status: 'ready'
    }));

    setUploadedFiles(prevFiles => {
      const newFiles = multiple ? [...prevFiles, ...filesWithPreview] : filesWithPreview;
      return newFiles.slice(0, maxFiles);
    });

    if (onFilesSelected) {
      onFilesSelected(multiple ? filesWithPreview : filesWithPreview[0]);
    }
  }, [acceptedFileTypes, maxFiles, maxSize, multiple, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {}),
    maxFiles: maxFiles,
    maxSize: maxSize,
    disabled: disabled,
    multiple: multiple
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.id !== fileId);
      if (onFilesSelected) {
        onFilesSelected(multiple ? updatedFiles : updatedFiles[0] || null);
      }
      return updatedFiles;
    });
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    if (onFilesSelected) {
      onFilesSelected(multiple ? [] : null);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`upload-area cursor-pointer transition-all duration-200 ${
          isDragActive ? 'active' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
          uploadedFiles.length > 0 ? 'border-solid border-primary-500 bg-primary-50 dark:bg-primary-900/10' : ''
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          {uploadedFiles.length === 0 ? (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {isDragActive ? 'Drop files here' : 'Upload your files'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your files here, or click to browse
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                <p>Supported formats: {acceptedFileTypes.join(', ')}</p>
                <p>Max file size: {formatFileSize(maxSize)}</p>
                {maxFiles > 1 && <p>Max files: {maxFiles}</p>}
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Files uploaded successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready for processing
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 dark:text-red-400">{uploadError}</span>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            {uploadedFiles.length > 1 && (
              <button
                onClick={clearAllFiles}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {uploadedFiles.map((fileData) => {
              const FileIcon = getFileIcon(fileData.type);
              return (
                <div
                  key={fileData.id}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {fileData.preview ? (
                      <img
                        src={fileData.preview}
                        alt={fileData.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {fileData.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(fileData.size)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {fileData.status === 'ready' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {fileData.status === 'processing' && (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {fileData.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
