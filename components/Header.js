import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from './ThemeContext';
import MegaMenu from './MegaMenu';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search, 
  Zap,
  Image,
  Video,
  FileText,
  Archive,
  Globe,
  Brain,
  ChevronDown
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toolCategories = [
    { name: 'Image Tools', href: '/image-tools', icon: Image, count: '80+' },
    { name: 'Video Tools', href: '/video-tools', icon: Video, count: '50+' },
    { name: 'PDF Tools', href: '/pdf-tools', icon: FileText, count: '40+' },
    { name: 'Audio Tools', href: '/audio-tools', icon: Archive, count: '30+' },
    { name: 'Web Tools', href: '/web-tools', icon: Globe, count: '25+' },
    { name: 'AI Tools', href: '/ai-tools', icon: Brain, count: '25+' },
    { name: 'Compress Tools', href: '/compress-tools', icon: Archive, count: '20+' },
  ];

  const navigation = [
    { name: 'All Tools', href: '/tools' },
    { name: 'API', href: '/api-docs' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-3 transition-all duration-300">
        {/* Mobile safe area padding */}
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-primary-500 dark:bg-primary-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ImageOptimizer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Tools Dropdown */}
            <div className="relative group">
              <button 
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => {
                  // Add delay to prevent immediate closing when moving to mega menu
                  setTimeout(() => {
                    if (!document.querySelector('.mega-menu:hover')) {
                      setIsMegaMenuOpen(false);
                    }
                  }, 200);
                }}
                className="flex items-center space-x-1 text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <span className="font-medium">Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Other Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-gray-300 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        </div>
      </nav>

      {/* Mega Menu - Outside of nav container for full width */}
      <MegaMenu 
        isOpen={isMegaMenuOpen} 
        onClose={() => setIsMegaMenuOpen(false)} 
      />

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="px-4 py-4">
              {/* Mobile Tools */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Popular Tools
                </h3>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <Link
                    href="/image-tools/avif-to-jpg"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">AVIF to JPG</span>
                  </Link>
                  <Link
                    href="/image-tools/avif-to-png"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">AVIF to PNG</span>
                  </Link>
                  <Link
                    href="/image-tools/heic-to-jpg"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">HEIC to JPG</span>
                  </Link>
                  <Link
                    href="/image-tools/heic-to-png"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">HEIC to PNG</span>
                  </Link>
                  <Link
                    href="/pdf-tools/merge-pdf"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Merge PDF</span>
                  </Link>
                  <Link
                    href="/video-tools/mp4-to-gif"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Video className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">MP4 to GIF</span>
                  </Link>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                  All Categories
                </h3>
                <div className="space-y-2">
                  {toolCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {React.createElement(category.icon, { className: "w-5 h-5 text-primary-500" })}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {category.count} tools
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-gray-700 dark:text-white hover:text-primary-500 dark:hover:text-gray-300 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

    </header>
  );
};

export default Header;
