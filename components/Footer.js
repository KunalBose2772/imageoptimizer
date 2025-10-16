import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const popularTools = [
    { name: 'AVIF to JPG', href: '/image-tools/avif-to-jpg' },
    { name: 'HEIC to JPG', href: '/image-tools/heic-to-jpg' },
    { name: 'PDF to Word', href: '/pdf-tools/pdf-to-word' },
    { name: 'MP4 to GIF', href: '/video-tools/mp4-to-gif' },
    { name: 'Compress Image', href: '/compress-tools/compress-image' },
    { name: 'Remove Background', href: '/ai-tools/remove-background' },
    { name: 'QR Generator', href: '/web-tools/qr-generator' },
    { name: 'Merge PDF', href: '/pdf-tools/merge-pdf' },
  ];

  const quickLinks = [
    { name: 'All Tools', href: '/tools' },
    { name: 'Image Tools', href: '/image-tools' },
    { name: 'Video Tools', href: '/video-tools' },
    { name: 'PDF Tools', href: '/pdf-tools' },
    { name: 'AI Tools', href: '/ai-tools' },
    { name: 'Web Tools', href: '/web-tools' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press Kit', href: '/press' },
    { name: 'Status', href: '/status' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const resourceLinks = [
    { name: 'API Documentation', href: '/api-docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Blog', href: '/blog' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Affiliate Program', href: '/affiliate' },
    { name: 'Sitemap', href: '/sitemap' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'DMCA', href: '/dmca' },
    { name: 'GDPR', href: '/gdpr' },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-100">
                ImageOptimizer
              </span>
              <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full font-medium">
                .in
              </span>
            </Link>
            <p className="text-gray-300 mb-6">
              The ultimate all-in-one file converter, compressor, and optimizer platform. 
              Convert, compress, and optimize images, videos, PDFs, and more with 300+ free tools.
            </p>
            
            {/* Platform Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="text-2xl font-bold text-primary-500">300+</div>
                <div className="text-xs text-gray-400">Free Tools</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="text-2xl font-bold text-primary-500">1M+</div>
                <div className="text-xs text-gray-400">Users</div>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
          </div>


          {/* Popular Tools */}
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Popular Tools</h4>
            <ul className="space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Resources</h4>
            <ul className="space-y-2 mb-6">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <div className="text-gray-400 text-sm mb-2">
                © 2024 ImageOptimizer.in. All rights reserved. Made with ❤️ for creators worldwide.
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-500">
                <span>300+ Free Tools</span>
                <span>•</span>
                <span>No Registration Required</span>
                <span>•</span>
                <span>100% Secure</span>
                <span>•</span>
                <span>Processed in Seconds</span>
                <span>•</span>
                <span>Supports 50+ Formats</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>99.9% Uptime</span>
                  <span>•</span>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>GDPR Compliant</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:hello@imageoptimizer.in"
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-primary-500 transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </a>
                <button
                  onClick={scrollToTop}
                  className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;