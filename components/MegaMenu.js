import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Image, 
  FileText, 
  Video, 
  Music, 
  Archive, 
  Brain, 
  Globe, 
  Zap,
  ChevronRight,
  Star
} from 'lucide-react';

const MegaMenu = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('image');
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setActiveCategory('image'); // Always start with image tools
    }
  }, [isOpen]);

  // Handle mouse leave to close menu with proper delay
  const handleMouseLeave = () => {
    setTimeout(() => {
      onClose();
    }, 300); // Increased delay to allow clicking
  };

  // Handle mouse enter to keep menu open
  const handleMouseEnter = () => {
    // Cancel any pending close
    if (menuRef.current) {
      menuRef.current.style.pointerEvents = 'auto';
    }
  };

  const categories = [
    {
      id: 'image',
      name: 'Image Tools',
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
      tools: [
        { name: 'AVIF to JPG', href: '/image-tools/avif-to-jpg', popular: true },
        { name: 'AVIF to PNG', href: '/image-tools/avif-to-png', popular: true },
        { name: 'AVIF to WEBP', href: '/image-tools/avif-to-webp', popular: true },
        { name: 'JPG to AVIF', href: '/image-tools/jpg-to-avif', popular: true },
        { name: 'PNG to AVIF', href: '/image-tools/png-to-avif', popular: true },
        { name: 'HEIC to JPG', href: '/image-tools/heic-to-jpg', popular: false },
        { name: 'JPG to PNG', href: '/image-tools/jpg-to-png', popular: false },
        { name: 'PNG to WebP', href: '/image-tools/png-to-webp', popular: false },
        { name: 'Image Resizer', href: '/image-tools/image-resizer', popular: false },
        { name: 'Image Cropper', href: '/image-tools/image-cropper', popular: false },
        { name: 'Rotate Image', href: '/image-tools/rotate-image', popular: false },
        { name: 'Blur Image', href: '/image-tools/blur-image', popular: false },
      ]
    },
    {
      id: 'pdf',
      name: 'PDF Tools',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      tools: [
        { name: 'Merge PDF', href: '/pdf-tools/merge-pdf', popular: true },
        { name: 'PDF to Word', href: '/pdf-tools/pdf-to-word', popular: true },
        { name: 'PDF to JPG', href: '/pdf-tools/pdf-to-jpg', popular: false },
        { name: 'PDF to PNG', href: '/pdf-tools/pdf-to-png', popular: false },
        { name: 'Split PDF', href: '/pdf-tools/split-pdf', popular: false },
        { name: 'Compress PDF', href: '/pdf-tools/compress-pdf', popular: false },
        { name: 'PDF to Excel', href: '/pdf-tools/pdf-to-excel', popular: false },
        { name: 'PDF to PowerPoint', href: '/pdf-tools/pdf-to-powerpoint', popular: false },
      ]
    },
    {
      id: 'video',
      name: 'Video Tools',
      icon: Video,
      color: 'from-red-500 to-orange-500',
      tools: [
        { name: 'MP4 to GIF', href: '/video-tools/mp4-to-gif', popular: true },
        { name: 'Video Compressor', href: '/video-tools/video-compressor', popular: true },
        { name: 'MP4 to AVI', href: '/video-tools/mp4-to-avi', popular: false },
        { name: 'AVI to MP4', href: '/video-tools/avi-to-mp4', popular: false },
        { name: 'Video to Audio', href: '/video-tools/video-to-audio', popular: false },
        { name: 'Video Resizer', href: '/video-tools/video-resizer', popular: false },
        { name: 'Video Cropper', href: '/video-tools/video-cropper', popular: false },
        { name: 'Video Rotator', href: '/video-tools/video-rotator', popular: false },
      ]
    },
    {
      id: 'audio',
      name: 'Audio Tools',
      icon: Music,
      color: 'from-green-500 to-teal-500',
      tools: [
        { name: 'MP3 Converter', href: '/audio-tools/mp3-converter', popular: true },
        { name: 'Audio Compressor', href: '/audio-tools/audio-compressor', popular: true },
        { name: 'WAV to MP3', href: '/audio-tools/wav-to-mp3', popular: false },
        { name: 'MP3 to WAV', href: '/audio-tools/mp3-to-wav', popular: false },
        { name: 'Audio Cutter', href: '/audio-tools/audio-cutter', popular: false },
        { name: 'Audio Joiner', href: '/audio-tools/audio-joiner', popular: false },
        { name: 'Audio Speed Changer', href: '/audio-tools/audio-speed-changer', popular: false },
        { name: 'Audio Volume Booster', href: '/audio-tools/audio-volume-booster', popular: false },
      ]
    },
    {
      id: 'archive',
      name: 'Archive Tools',
      icon: Archive,
      color: 'from-yellow-500 to-orange-500',
      tools: [
        { name: 'ZIP Creator', href: '/archive-tools/zip-creator', popular: true },
        { name: 'ZIP Extractor', href: '/archive-tools/zip-extractor', popular: true },
        { name: 'RAR to ZIP', href: '/archive-tools/rar-to-zip', popular: false },
        { name: '7Z to ZIP', href: '/archive-tools/7z-to-zip', popular: false },
        { name: 'Archive Compressor', href: '/archive-tools/archive-compressor', popular: false },
        { name: 'Archive Splitter', href: '/archive-tools/archive-splitter', popular: false },
        { name: 'Archive Password Remover', href: '/archive-tools/archive-password-remover', popular: false },
        { name: 'Archive Repair', href: '/archive-tools/archive-repair', popular: false },
      ]
    },
    {
      id: 'ai',
      name: 'AI Tools',
      icon: Brain,
      color: 'from-pink-500 to-purple-500',
      tools: [
        { name: 'Remove Background', href: '/ai-tools/remove-background', popular: true },
        { name: 'AI Image Upscaler', href: '/ai-tools/ai-image-upscaler', popular: true },
        { name: 'AI Image Generator', href: '/ai-tools/ai-image-generator', popular: false },
        { name: 'AI Image Enhancer', href: '/ai-tools/ai-image-enhancer', popular: false },
        { name: 'AI Background Generator', href: '/ai-tools/ai-background-generator', popular: false },
        { name: 'AI Text Generator', href: '/ai-tools/ai-text-generator', popular: false },
        { name: 'AI Logo Generator', href: '/ai-tools/ai-logo-generator', popular: false },
        { name: 'AI Color Palette', href: '/ai-tools/ai-color-palette', popular: false },
      ]
    },
    {
      id: 'web',
      name: 'Web Tools',
      icon: Globe,
      color: 'from-cyan-500 to-blue-500',
      tools: [
        { name: 'QR Generator', href: '/web-tools/qr-generator', popular: true },
        { name: 'URL Shortener', href: '/web-tools/url-shortener', popular: true },
        { name: 'Password Generator', href: '/web-tools/password-generator', popular: false },
        { name: 'Color Picker', href: '/web-tools/color-picker', popular: false },
        { name: 'Base64 Encoder', href: '/web-tools/base64-encoder', popular: false },
        { name: 'JSON Formatter', href: '/web-tools/json-formatter', popular: false },
        { name: 'HTML Minifier', href: '/web-tools/html-minifier', popular: false },
        { name: 'CSS Minifier', href: '/web-tools/css-minifier', popular: false },
      ]
    }
  ];

  if (!isOpen) return null;

  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  return (
    <div 
      ref={menuRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="mega-menu fixed top-16 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-2xl border-b border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[400px] max-w-7xl mx-auto">
          {/* Categories Sidebar - Vertical Tabs */}
          <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                        activeCategory === category.id
                          ? 'bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600'
                          : 'hover:bg-white dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          activeCategory === category.id 
                            ? 'text-primary-500 dark:text-primary-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {category.tools.length} tools
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tools Content - 1-3 Columns */}
          <div className="lg:col-span-3 p-6">
            {activeCategoryData && (
              <div className="h-full">
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 bg-gradient-to-r ${activeCategoryData.color} rounded-lg flex items-center justify-center`}>
                    {React.createElement(activeCategoryData.icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {activeCategoryData.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activeCategoryData.tools.length} tools available
                    </p>
                  </div>
                </div>

                {/* Tools Grid - Responsive Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {activeCategoryData.tools.map((tool, index) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      onClick={onClose}
                      className="group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                      style={{
                        animationDelay: `${index * 30}ms`,
                        animation: 'fadeInUp 0.3s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                              {tool.name}
                            </span>
                            {tool.popular && (
                              <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {tool.popular ? 'Popular' : 'Free Tool'}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MegaMenu;
