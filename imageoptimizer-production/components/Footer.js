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

  const toolCategories = [
    { name: 'Image Tools', href: '/image-tools', count: '80+' },
    { name: 'Video Tools', href: '/video-tools', count: '50+' },
    { name: 'PDF Tools', href: '/pdf-tools', count: '40+' },
    { name: 'Audio Tools', href: '/audio-tools', count: '30+' },
    { name: 'Archive Tools', href: '/archive-tools', count: '15+' },
    { name: 'Web Tools', href: '/web-tools', count: '25+' },
    { name: 'AI Tools', href: '/ai-tools', count: '25+' },
    { name: 'Compress Tools', href: '/compress-tools', count: '20+' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press Kit', href: '/press' },
    { name: 'Status', href: '/status' },
  ];

  const resourceLinks = [
    { name: 'API Documentation', href: '/api-docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Blog', href: '/blog' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Affiliate Program', href: '/affiliate' },
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
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {/* Newsletter Section */}
      <div className="bg-gradient-primary">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="heading-3 text-white mb-4">
              Stay Updated with ImageOptimizer.in
            </h3>
            <p className="text-large text-blue-100 mb-8">
              Get the latest updates on new tools, features, and optimization tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
              />
              <button className="btn-secondary bg-white text-primary-500 hover:bg-gray-100 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                ImageOptimizer
              </span>
              <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full font-medium">
                .in
              </span>
            </Link>
            <p className="text-body mb-6">
              The ultimate all-in-one file converter, compressor, and optimizer platform. 
              Convert, compress, and optimize images, videos, PDFs, and more with 300+ free tools.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Tool Categories */}
          <div>
            <h4 className="heading-4 mb-6">Tool Categories</h4>
            <ul className="space-y-3">
              {toolCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Resources */}
          <div>
            <h4 className="heading-4 mb-6">Company</h4>
            <ul className="space-y-3 mb-8">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="heading-4 mb-6">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="heading-4 mb-6">Legal</h4>
            <ul className="space-y-3 mb-8">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="heading-4 mb-6">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@imageoptimizer.in"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>hello@imageoptimizer.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 ImageOptimizer.in. All rights reserved. Made with ❤️ for creators worldwide.
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <button
                onClick={scrollToTop}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
