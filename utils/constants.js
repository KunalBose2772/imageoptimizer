// ImageOptimizer.in Constants

export const APP_CONFIG = {
  name: 'ImageOptimizer.in',
  description: 'The Ultimate All-in-One File Converter, Compressor & Optimizer',
  url: 'https://imageoptimizer.in',
  version: '1.0.0',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 10,
  supportedImageFormats: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    'image/heic',
    'image/heif'
  ],
  supportedVideoFormats: [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'video/3gp'
  ],
  supportedAudioFormats: [
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'audio/flac',
    'audio/aac'
  ],
  supportedDocumentFormats: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
};

export const API_ENDPOINTS = {
  // Image APIs
  imageConversion: '/api/image/convert',
  imageCompression: '/api/image/compress',
  imageResize: '/api/image/resize',
  imageCrop: '/api/image/crop',
  
  // Video APIs
  videoConversion: '/api/video/convert',
  videoCompression: '/api/video/compress',
  videoTrim: '/api/video/trim',
  
  // PDF APIs
  pdfMerge: '/api/pdf/merge',
  pdfSplit: '/api/pdf/split',
  pdfCompress: '/api/pdf/compress',
  pdfToWord: '/api/pdf/to-word',
  
  // AI APIs
  backgroundRemoval: '/api/ai/remove-background',
  imageUpscale: '/api/ai/upscale',
  ocr: '/api/ai/ocr'
};

export const TOOL_CATEGORIES = [
  {
    name: 'Image Tools',
    slug: 'image-tools',
    description: 'Convert, compress, and enhance images',
    count: 80,
    color: 'blue',
    icon: 'Image'
  },
  {
    name: 'Video Tools',
    slug: 'video-tools',
    description: 'Convert and edit video files',
    count: 50,
    color: 'purple',
    icon: 'Video'
  },
  {
    name: 'PDF Tools',
    slug: 'pdf-tools',
    description: 'Merge, split, and convert PDFs',
    count: 40,
    color: 'red',
    icon: 'FileText'
  },
  {
    name: 'Audio Tools',
    slug: 'audio-tools',
    description: 'Convert and edit audio files',
    count: 30,
    color: 'green',
    icon: 'Archive'
  },
  {
    name: 'Web Tools',
    slug: 'web-tools',
    description: 'QR codes, screenshots, and more',
    count: 25,
    color: 'indigo',
    icon: 'Globe'
  },
  {
    name: 'AI Tools',
    slug: 'ai-tools',
    description: 'AI-powered image enhancement',
    count: 25,
    color: 'pink',
    icon: 'Brain'
  },
  {
    name: 'Compress Tools',
    slug: 'compress-tools',
    description: 'Reduce file sizes efficiently',
    count: 20,
    color: 'orange',
    icon: 'Compress'
  },
  {
    name: 'Archive Tools',
    slug: 'archive-tools',
    description: 'Create and extract archives',
    count: 15,
    color: 'teal',
    icon: 'Archive'
  }
];

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',
  INVALID_FILE_TYPE: 'File type is not supported',
  PROCESSING_ERROR: 'An error occurred while processing the file',
  UPLOAD_ERROR: 'Failed to upload file',
  CONVERSION_ERROR: 'Failed to convert file',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later'
};

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  CONVERSION_COMPLETE: 'Conversion completed successfully',
  COMPRESSION_COMPLETE: 'Compression completed successfully',
  PROCESSING_COMPLETE: 'Processing completed successfully'
};
