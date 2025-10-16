import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import HyperspeedBackground from '../components/HyperspeedBackground';
import SpotlightCard from '../components/SpotlightCard';
import CardSwap, { Card } from '../components/CardSwap';
import { 
  Zap, 
  Image, 
  Video, 
  FileText, 
  Archive, 
  Globe, 
  Brain, 
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Play,
  Download,
  Upload,
  Sparkles,
  Mail,
  Send,
  CheckCircle2,
  ArrowRightCircle,
  Rocket
} from 'lucide-react';

// FAQ Accordion Component
const FAQAccordion = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0); // First FAQ open by default

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <h3 className="heading-4 text-gray-900 dark:text-white pr-4">{question}</h3>
        <div className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-body text-gray-600 dark:text-gray-300 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [stats, setStats] = useState({
    tools: 0,
    users: 0,
    processing: 0,
    uptime: 0
  });

  // Animate counters on scroll
  useEffect(() => {
    const animateCounters = () => {
      const targetStats = {
        tools: 300,
        users: 1000000,
        processing: 3,
        uptime: 99.9
      };

      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          tools: Math.floor(targetStats.tools * progress),
          users: Math.floor(targetStats.users * progress),
          processing: targetStats.processing,
          uptime: (targetStats.uptime * progress).toFixed(1)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const timer = setTimeout(animateCounters, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toolCategories = [
    {
      name: 'Image Tools',
      description: 'Convert, compress, and enhance images',
      icon: Image,
      count: '80+',
      href: '/image-tools',
      color: 'bg-blue-400'
    },
    {
      name: 'Video Tools',
      description: 'Convert and edit video files',
      icon: Video,
      count: '50+',
      href: '/video-tools',
      color: 'bg-purple-500'
    },
    {
      name: 'PDF Tools',
      description: 'Merge, split, and convert PDFs',
      icon: FileText,
      count: '40+',
      href: '/pdf-tools',
      color: 'bg-red-500'
    },
    {
      name: 'Audio Tools',
      description: 'Convert and edit audio files',
      icon: Archive,
      count: '30+',
      href: '/audio-tools',
      color: 'bg-green-500'
    },
    {
      name: 'Web Tools',
      description: 'QR codes, screenshots, and more',
      icon: Globe,
      count: '25+',
      href: '/web-tools',
      color: 'bg-indigo-500'
    },
    {
      name: 'AI Tools',
      description: 'AI-powered image enhancement',
      icon: Brain,
      count: '25+',
      href: '/ai-tools',
      color: 'bg-purple-500'
    },
    {
      name: 'Compress Tools',
      description: 'Reduce file sizes efficiently',
      icon: Archive,
      count: '20+',
      href: '/compress-tools',
      color: 'bg-orange-500'
    },
    {
      name: 'Archive Tools',
      description: 'Create and extract archives',
      icon: Archive,
      count: '15+',
      href: '/archive-tools',
      color: 'bg-teal-500'
    }
  ];

  const featuredTools = [
    {
      name: 'AVIF to JPG',
      description: 'Convert modern AVIF images to universal JPG format',
      href: '/image-tools/avif-to-jpg',
      icon: Image,
      popular: true
    },
    {
      name: 'HEIC to JPG',
      description: 'Convert iPhone HEIC photos to JPG',
      href: '/image-tools/heic-to-jpg',
      icon: Image,
      popular: true
    },
    {
      name: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      href: '/pdf-tools/pdf-to-word',
      icon: FileText,
      popular: true
    },
    {
      name: 'MP4 to GIF',
      description: 'Create animated GIFs from video files',
      href: '/video-tools/mp4-to-gif',
      icon: Video,
      popular: false
    },
    {
      name: 'Compress Image',
      description: 'Reduce image file size without quality loss',
      href: '/compress-tools/compress-image',
      icon: Archive,
      popular: true
    },
    {
      name: 'Remove Background',
      description: 'AI-powered background removal tool',
      href: '/ai-tools/remove-background',
      icon: Brain,
      popular: true
    },
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one',
      href: '/pdf-tools/merge-pdf',
      icon: FileText,
      popular: false
    },
    {
      name: 'QR Generator',
      description: 'Create QR codes for any text or URL',
      href: '/web-tools/qr-generator',
      icon: Globe,
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process files in under 3 seconds with our optimized infrastructure',
      stat: '< 3s processing'
    },
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Advanced AI algorithms for superior image enhancement and processing',
      stat: '25+ AI tools'
    },
    {
      icon: Shield,
      title: '100% Free',
      description: 'All tools are completely free with no hidden costs or limitations',
      stat: 'No credit card required'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Graphic Designer',
      content: 'ImageOptimizer.in has revolutionized my workflow. The AI background removal is incredibly accurate!',
      rating: 5,
      avatar: '/images/testimonial-1.jpg'
    },
    {
      name: 'Mike Chen',
      role: 'Content Creator',
      content: 'Converting HEIC files from my iPhone was such a pain before. Now it takes seconds!',
      rating: 5,
      avatar: '/images/testimonial-2.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      content: 'The batch processing feature saves me hours every week. Highly recommended!',
      rating: 5,
      avatar: '/images/testimonial-3.jpg'
    }
  ];

  const faqs = [
    {
      question: 'Is ImageOptimizer.in really free?',
      answer: 'Yes! All our tools are completely free to use with no hidden costs, watermarks, or limitations. We believe in providing accessible tools for everyone.'
    },
    {
      question: 'How secure are my uploaded files?',
      answer: 'Your privacy and security are our top priorities. All files are automatically deleted from our servers within 24 hours, and we use enterprise-grade encryption.'
    },
    {
      question: 'What file formats do you support?',
      answer: 'We support over 100 file formats including images (JPG, PNG, WebP, AVIF, HEIC), videos (MP4, MOV, MKV), documents (PDF, Word, Excel), and many more.'
    },
    {
      question: 'Can I use these tools for commercial purposes?',
      answer: 'Absolutely! All our tools can be used for personal and commercial purposes without any restrictions.'
    },
    {
      question: 'Do you have an API for developers?',
      answer: 'Yes! We offer a comprehensive API with 30+ endpoints for developers who want to integrate our tools into their applications.'
    },
    {
      question: 'How fast is the processing?',
      answer: 'Most files are processed in under 3 seconds. We use optimized infrastructure and AI algorithms to ensure the fastest possible processing times.'
    }
  ];

  return (
    <Layout 
      title="The Ultimate All-in-One File Converter, Compressor & Optimizer"
      description="300+ Free Tools for Images, Videos, PDFs, Audio & More. Powered by AI. Convert, compress, and optimize files in seconds."
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-20 hero-section-mobile">
        {/* Hyperspeed Background */}
        <HyperspeedBackground />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/30 dark:bg-black/40"></div>
        <div className="container-custom section-padding relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 dark:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-gray-300/30 dark:border-white/30">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 1M+ users worldwide</span>
            </div>
            
            <h1 className="heading-1 mb-6 text-gray-900 dark:text-white drop-shadow-lg dark:drop-shadow-lg">
              The Ultimate All-in-One{' '}
              <span className="bg-gradient-to-r from-primary-500 to-purple-500 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                File Converter
              </span>
            </h1>
            
            <p className="text-large mb-8 max-w-2xl mx-auto text-gray-700 dark:text-white/90 drop-shadow-md dark:drop-shadow-md">
              300+ Free Tools for Images, Videos, PDFs, Audio & More. 
              Powered by AI technology for the fastest and most accurate conversions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                Start Converting Now
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
              <button className="btn-outline text-lg px-8 py-4">
                View All Tools
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-700 dark:text-white/90">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span>Processed in Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Choose Your Tool Category
            </h2>
            <p className="text-large max-w-2xl mx-auto">
              Explore our comprehensive collection of tools organized by category. 
              Find exactly what you need in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolCategories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="card-hover p-6 text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${category.color}`}>
                  {React.createElement(category.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="heading-4 mb-2">{category.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${category.color.replace('bg-', 'text-')}`}>{category.count} tools</span>
                  <ArrowRight className={`w-4 h-4 text-gray-400 group-hover:${category.color.replace('bg-', 'text-')} group-hover:translate-x-1 transition-all duration-200`} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Most Popular Tools
            </h2>
            <p className="text-large max-w-2xl mx-auto">
              Start with our most popular and trusted tools. 
              Used by millions of users worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool, index) => (
              <a
                key={tool.name}
                href={tool.href}
                className="block"
              >
                <SpotlightCard 
                  className="card-hover p-6 group cursor-pointer"
                  spotlightColor="rgba(0, 123, 255, 0.15)"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    {React.createElement(tool.icon, { className: "w-6 h-6 text-primary-500" })}
                  </div>
                  <h3 className="heading-4 mb-2 text-gray-900 dark:text-white">{tool.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                  <div className="flex items-center text-primary-500 font-medium">
                    <span>Try Now</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </SpotlightCard>
              </a>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/tools" className="btn-outline">
              View All 300+ Tools
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Why Choose ImageOptimizer.in?
            </h2>
            <p className="text-large max-w-2xl mx-auto">
              Experience the difference with our cutting-edge technology and user-first approach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Feature Cards */}
            <div className="space-y-6">
              <div className="glass-morphism-box rounded-2xl p-6 flex items-start space-x-4 group">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <h3 className="heading-4 mb-2 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">Lightning Fast Processing</h3>
                  <p className="text-body text-gray-600 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200 transition-colors duration-300">
                    Our optimized infrastructure ensures your files are processed in under 3 seconds, 
                    making your workflow incredibly efficient.
                  </p>
                </div>
              </div>
            
              <div className="glass-morphism-box rounded-2xl p-6 flex items-start space-x-4 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                  <Brain className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <h3 className="heading-4 mb-2 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">AI-Powered Technology</h3>
                  <p className="text-body text-gray-600 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200 transition-colors duration-300">
                    Advanced AI algorithms provide superior image enhancement and processing capabilities 
                    that traditional tools simply can't match.
                  </p>
                </div>
              </div>
              
              <div className="glass-morphism-box rounded-2xl p-6 flex items-start space-x-4 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <h3 className="heading-4 mb-2 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">100% Free Forever</h3>
                  <p className="text-body text-gray-600 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200 transition-colors duration-300">
                    All our tools are completely free with no hidden costs, watermarks, or limitations. 
                    No credit card required.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - CardSwap */}
            <div style={{ height: '450px', position: 'relative' }}>
              <CardSwap
                cardDistance={60}
                verticalDistance={70}
                delay={5000}
                pauseOnHover={false}
                width={500}
                height={400}
              >
                {benefits.map((benefit, index) => {
                  // Different colors for each icon
                  const iconColors = [
                    'text-yellow-400', // Lightning - Yellow
                    'text-purple-400', // Brain - Purple
                    'text-green-400'   // Shield - Green
                  ];
                  const iconColor = iconColors[index] || 'text-primary-500';
                  
                  return (
                    <Card key={benefit.title} className="p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                        {React.createElement(benefit.icon, { className: `w-8 h-8 ${iconColor}` })}
                      </div>
                      <h3 className="heading-3 mb-4 text-gray-900 dark:text-white">{benefit.title}</h3>
                      <p className="text-body mb-4 text-gray-600 dark:text-gray-300">{benefit.description}</p>
                      <div className="text-sm font-medium text-primary-500">{benefit.stat}</div>
                    </Card>
                  );
                })}
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">
              Trusted by Millions Worldwide
            </h2>
            <p className="text-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join the growing community of users who rely on ImageOptimizer.in for their file conversion needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tools Available */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-300">
                  {stats.tools}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tools Available</div>
                <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Users Worldwide */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-green-500 transition-colors duration-300">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Users Worldwide</div>
                <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-4/5 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-4 right-4 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors duration-300">
                  &lt;{stats.processing}s
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Processing Time</div>
                <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Uptime */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-4 right-4 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors duration-300">
                  {stats.uptime}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Uptime</div>
                <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              What Our Users Say
            </h2>
            <p className="text-large max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our users have to say about their experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-body mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Got questions? We've got answers. Here are the most common questions about our platform.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQAccordion 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer}
                  index={index}
                />
              ))}
            </div>
            
            {/* FAQ Categories */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="heading-3 mb-4 text-gray-900 dark:text-white">
                  Browse by Category
                </h3>
                <p className="text-body text-gray-600 dark:text-gray-300">
                  Find answers organized by topic for faster navigation
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 group-hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="heading-4 mb-2 text-gray-900 dark:text-white">Getting Started</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Basic setup and first-time usage</p>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">8 Questions</div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 group-hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="heading-4 mb-2 text-gray-900 dark:text-white">Security & Privacy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Data protection and file security</p>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">5 Questions</div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 group-hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="heading-4 mb-2 text-gray-900 dark:text-white">AI Features</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Advanced AI tools and capabilities</p>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">6 Questions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-purple-100 via-blue-100 to-blue-200 dark:from-gray-800 dark:via-blue-900/50 dark:to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/80 dark:bg-white/20 backdrop-blur-sm rounded-2xl mb-8 border border-white/30 dark:border-white/20">
              <Rocket className="w-8 h-8 text-primary-600 dark:text-white" />
            </div>
            
            <h2 className="heading-2 text-gray-900 dark:text-white mb-6 drop-shadow-lg">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-700 dark:text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join millions of users who trust ImageOptimizer.in for their file conversion needs. 
              Start converting, compressing, and optimizing your files today with our powerful AI-driven tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button className="group bg-primary-600 text-white hover:bg-primary-700 dark:bg-white dark:text-primary-600 dark:hover:bg-gray-50 hover:scale-105 font-semibold py-5 px-10 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center shadow-xl">
                <Rocket className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Start Converting Now
                <ArrowRightCircle className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white dark:border-white/30 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/50 backdrop-blur-sm font-semibold py-5 px-10 rounded-2xl transition-all duration-300 text-lg">
                <Play className="w-5 h-5 mr-3 inline-block group-hover:scale-110 transition-transform duration-300" />
                View All Tools
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1M+</div>
                <div className="text-sm text-gray-600 dark:text-blue-200">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">300+</div>
                <div className="text-sm text-gray-600 dark:text-blue-200">Tools Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">&lt;3s</div>
                <div className="text-sm text-gray-600 dark:text-blue-200">Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-blue-200">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Tools List Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Complete Tool Directory</h2>
            <p className="text-large max-w-3xl mx-auto">Explore our comprehensive collection of 300+ tools organized by category. Everything you need for file conversion, compression, and optimization in one place.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            
            {/* Image Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Image Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">80+ tools</p>
                </div>
              </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <a href="/image-tools/avif-to-jpg" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">AVIF to JPG</a>
                    <a href="/image-tools/avif-to-png" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">AVIF to PNG</a>
                    <a href="/image-tools/avif-to-webp" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">AVIF to WEBP</a>
                    <a href="/image-tools/jpg-to-avif" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">JPG to AVIF</a>
                    <a href="/image-tools/png-to-avif" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">PNG to AVIF</a>
                    <a href="/image-tools/webp-to-avif" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">WEBP to AVIF</a>
                    <a href="/image-tools/heic-to-jpg" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">HEIC to JPG</a>
                    <a href="/image-tools/jpg-to-png" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">JPG to PNG</a>
                    <a href="/image-tools/png-to-webp" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">PNG to WebP</a>
                  </div>
                <div className="pt-2">
                  <a href="/image-tools" className="text-blue-500 hover:text-blue-600 font-medium text-sm">View All Image Tools →</a>
                </div>
              </div>
            </div>

            {/* Video Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="m22 8-6 4 6 4V8Z"></path>
                    <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Video Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">50+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/video-tools/mp4-to-gif" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">MP4 to GIF</a>
                  <a href="/video-tools/mp4-to-mov" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">MP4 to MOV</a>
                  <a href="/video-tools/video-to-mp3" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">Video to MP3</a>
                  <a href="/video-tools/crop-video" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">Crop Video</a>
                  <a href="/video-tools/trim-video" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">Trim Video</a>
                  <a href="/video-tools/merge-videos" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">Merge Videos</a>
                  <a href="/video-tools/change-resolution" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">Change Resolution</a>
                  <a href="/video-tools/add-watermark" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">Add Watermark</a>
                </div>
                <div className="pt-2">
                  <a href="/video-tools" className="text-purple-500 hover:text-purple-600 font-medium text-sm">View All Video Tools →</a>
                </div>
              </div>
            </div>

            {/* PDF Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" x2="8" y1="13" y2="13"></line>
                    <line x1="16" x2="8" y1="17" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">PDF Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">40+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/pdf-tools/pdf-to-word" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">PDF to Word</a>
                  <a href="/pdf-tools/pdf-to-jpg" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">PDF to JPG</a>
                  <a href="/pdf-tools/merge-pdf" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">Merge PDF</a>
                  <a href="/pdf-tools/split-pdf" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">Split PDF</a>
                  <a href="/pdf-tools/compress-pdf" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">Compress PDF</a>
                  <a href="/pdf-tools/unlock-pdf" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">Unlock PDF</a>
                  <a href="/pdf-tools/rotate-pdf" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">Rotate PDF</a>
                  <a href="/pdf-tools/add-watermark" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">Add Watermark</a>
                </div>
                <div className="pt-2">
                  <a href="/pdf-tools" className="text-red-500 hover:text-red-600 font-medium text-sm">View All PDF Tools →</a>
                </div>
              </div>
            </div>

            {/* Audio Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                    <path d="M10 12h4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Audio Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">30+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/audio-tools/mp3-to-wav" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">MP3 to WAV</a>
                  <a href="/audio-tools/wav-to-mp3" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">WAV to MP3</a>
                  <a href="/audio-tools/mp3-to-ogg" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">MP3 to OGG</a>
                  <a href="/audio-tools/mp3-to-flac" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">MP3 to FLAC</a>
                  <a href="/audio-tools/trim-audio" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">Trim Audio</a>
                  <a href="/audio-tools/merge-audio" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">Merge Audio</a>
                  <a href="/audio-tools/adjust-volume" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">Adjust Volume</a>
                  <a href="/audio-tools/add-fade" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">Add Fade</a>
                </div>
                <div className="pt-2">
                  <a href="/audio-tools" className="text-green-500 hover:text-green-600 font-medium text-sm">View All Audio Tools →</a>
                </div>
              </div>
            </div>

            {/* Web Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Web Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">25+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/web-tools/qr-generator" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">QR Generator</a>
                  <a href="/web-tools/url-shortener" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">URL Shortener</a>
                  <a href="/web-tools/website-screenshot" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">Website Screenshot</a>
                  <a href="/web-tools/favicon-generator" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">Favicon Generator</a>
                  <a href="/web-tools/html-minifier" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">HTML Minifier</a>
                  <a href="/web-tools/css-minifier" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">CSS Minifier</a>
                  <a href="/web-tools/password-generator" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">Password Generator</a>
                  <a href="/web-tools/base64-encoder" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">Base64 Encoder</a>
                </div>
                <div className="pt-2">
                  <a href="/web-tools" className="text-indigo-500 hover:text-indigo-600 font-medium text-sm">View All Web Tools →</a>
                </div>
              </div>
            </div>

            {/* AI Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">AI Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">25+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/ai-tools/remove-background" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Remove Background</a>
                  <a href="/ai-tools/ai-upscale" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">AI Upscale</a>
                  <a href="/ai-tools/image-colorizer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Image Colorizer</a>
                  <a href="/ai-tools/image-deblur" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Image Deblur</a>
                  <a href="/ai-tools/face-retouch" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Face Retouch</a>
                  <a href="/ai-tools/noise-reducer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Noise Reducer</a>
                  <a href="/ai-tools/object-remover" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Object Remover</a>
                  <a href="/ai-tools/photo-enhancer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Photo Enhancer</a>
                </div>
                <div className="pt-2">
                  <a href="/ai-tools" className="text-purple-600 hover:text-purple-700 font-medium text-sm">View All AI Tools →</a>
                </div>
              </div>
            </div>

            {/* Archive Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                    <path d="M10 12h4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Archive Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">15+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/archive-tools/create-zip" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Create ZIP</a>
                  <a href="/archive-tools/extract-zip" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Extract ZIP</a>
                  <a href="/archive-tools/create-rar" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Create RAR</a>
                  <a href="/archive-tools/extract-rar" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Extract RAR</a>
                  <a href="/archive-tools/create-7z" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Create 7Z</a>
                  <a href="/archive-tools/extract-7z" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Extract 7Z</a>
                  <a href="/archive-tools/password-protect" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Password Protect</a>
                  <a href="/archive-tools/convert-archive" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Convert Archive</a>
                </div>
                <div className="pt-2">
                  <a href="/archive-tools" className="text-teal-500 hover:text-teal-600 font-medium text-sm">View All Archive Tools →</a>
                </div>
              </div>
            </div>

            {/* Compress Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="5" x="2" y="3" rx="1"></rect>
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                    <path d="M10 12h4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Compress Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">20+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/compress-tools/compress-image" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Compress Image</a>
                  <a href="/compress-tools/compress-pdf" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Compress PDF</a>
                  <a href="/compress-tools/compress-mp4" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Compress MP4</a>
                  <a href="/compress-tools/compress-to-100kb" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Compress to 100KB</a>
                  <a href="/compress-tools/compress-to-1mb" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Compress to 1MB</a>
                  <a href="/compress-tools/batch-compress" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Batch Compress</a>
                  <a href="/compress-tools/lossless-compress" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Lossless Compress</a>
                  <a href="/compress-tools/shopify-compress" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">Shopify Compress</a>
                </div>
                <div className="pt-2">
                  <a href="/compress-tools" className="text-orange-500 hover:text-orange-600 font-medium text-sm">View All Compress Tools →</a>
                </div>
              </div>
            </div>

            {/* E-commerce Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"></path>
                    <path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">E-commerce Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">20+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/ecommerce-tools/shopify-optimizer" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">Shopify Optimizer</a>
                  <a href="/ecommerce-tools/product-image-resizer" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">Product Image Resizer</a>
                  <a href="/ecommerce-tools/bulk-converter" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">Bulk Converter</a>
                  <a href="/ecommerce-tools/invoice-generator" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">Invoice Generator</a>
                  <a href="/ecommerce-tools/barcode-generator" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">Barcode Generator</a>
                  <a href="/ecommerce-tools/mockup-generator" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">Mockup Generator</a>
                  <a href="/ecommerce-tools/ad-generator" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">Ad Generator</a>
                  <a href="/ecommerce-tools/seo-title-generator" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">SEO Title Generator</a>
                </div>
                <div className="pt-2">
                  <a href="/ecommerce-tools" className="text-emerald-500 hover:text-emerald-600 font-medium text-sm">View All E-commerce Tools →</a>
                </div>
              </div>
            </div>

            {/* Design Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Design Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">15+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/design-tools/logo-designer" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Logo Designer</a>
                  <a href="/design-tools/business-card-designer" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Business Card Designer</a>
                  <a href="/design-tools/flyer-designer" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Flyer Designer</a>
                  <a href="/design-tools/banner-designer" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Banner Designer</a>
                  <a href="/design-tools/certificate-generator" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Certificate Generator</a>
                  <a href="/design-tools/badge-generator" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Badge Generator</a>
                  <a href="/design-tools/icon-generator" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Icon Generator</a>
                  <a href="/design-tools/gradient-generator" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">Gradient Generator</a>
                </div>
                <div className="pt-2">
                  <a href="/design-tools" className="text-pink-500 hover:text-pink-600 font-medium text-sm">View All Design Tools →</a>
                </div>
              </div>
            </div>

            {/* Mobile Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                    <line x1="12" x2="12.01" y1="18" y2="18"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Mobile Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">15+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/mobile-tools/android-icon-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">Android Icon Generator</a>
                  <a href="/mobile-tools/ios-icon-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">iOS Icon Generator</a>
                  <a href="/mobile-tools/app-screenshot-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">App Screenshot Generator</a>
                  <a href="/mobile-tools/splash-screen-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">Splash Screen Generator</a>
                  <a href="/mobile-tools/wallpaper-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">Wallpaper Generator</a>
                  <a href="/mobile-tools/widget-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">Widget Generator</a>
                  <a href="/mobile-tools/theme-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">Theme Generator</a>
                  <a href="/mobile-tools/notification-icon-generator" className="text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors">Notification Icon Generator</a>
                </div>
                <div className="pt-2">
                  <a href="/mobile-tools" className="text-cyan-500 hover:text-cyan-600 font-medium text-sm">View All Mobile Tools →</a>
                </div>
              </div>
            </div>

            {/* Education Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Education Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">10+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/education-tools/certificate-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">Certificate Generator</a>
                  <a href="/education-tools/diploma-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">Diploma Generator</a>
                  <a href="/education-tools/quiz-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">Quiz Generator</a>
                  <a href="/education-tools/worksheet-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">Worksheet Generator</a>
                  <a href="/education-tools/report-card-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">Report Card Generator</a>
                  <a href="/education-tools/id-card-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">ID Card Generator</a>
                  <a href="/education-tools/badge-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">Badge Generator</a>
                  <a href="/education-tools/flashcard-generator" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">Flashcard Generator</a>
                </div>
                <div className="pt-2">
                  <a href="/education-tools" className="text-yellow-500 hover:text-yellow-600 font-medium text-sm">View All Education Tools →</a>
                </div>
              </div>
            </div>

            {/* Healthcare Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Healthcare Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">10+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/healthcare-tools/medical-report-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Medical Report Generator</a>
                  <a href="/healthcare-tools/prescription-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Prescription Generator</a>
                  <a href="/healthcare-tools/patient-id-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Patient ID Generator</a>
                  <a href="/healthcare-tools/medical-certificate-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Medical Certificate Generator</a>
                  <a href="/healthcare-tools/health-chart-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Health Chart Generator</a>
                  <a href="/healthcare-tools/appointment-card-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Appointment Card Generator</a>
                  <a href="/healthcare-tools/medical-badge-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Medical Badge Generator</a>
                  <a href="/healthcare-tools/insurance-card-generator" className="text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">Insurance Card Generator</a>
                </div>
                <div className="pt-2">
                  <a href="/healthcare-tools" className="text-red-600 hover:text-red-700 font-medium text-sm">View All Healthcare Tools →</a>
                </div>
              </div>
            </div>

            {/* Business Tools */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"></path>
                    <path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="heading-4 text-gray-900 dark:text-white">Business Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">15+ tools</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/business-tools/business-card-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Business Card Generator</a>
                  <a href="/business-tools/letterhead-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Letterhead Generator</a>
                  <a href="/business-tools/invoice-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Invoice Generator</a>
                  <a href="/business-tools/receipt-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Receipt Generator</a>
                  <a href="/business-tools/quote-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Quote Generator</a>
                  <a href="/business-tools/contract-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Contract Generator</a>
                  <a href="/business-tools/employee-id-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Employee ID Generator</a>
                  <a href="/business-tools/company-badge-generator" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 transition-colors">Company Badge Generator</a>
                </div>
                <div className="pt-2">
                  <a href="/business-tools" className="text-gray-700 hover:text-gray-800 font-medium text-sm">View All Business Tools →</a>
                </div>
              </div>
            </div>

          </div>

          {/* API Tools Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="heading-3 text-gray-900 dark:text-white mb-4">Developer APIs</h3>
              <p className="text-large max-w-2xl mx-auto text-gray-600 dark:text-gray-300">Integrate our powerful tools into your applications with our comprehensive API suite.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Image APIs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Convert, compress, and enhance images via API</p>
                <a href="/api/image-conversion" className="text-blue-500 hover:text-blue-600 font-medium text-sm">View APIs →</a>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="m22 8-6 4 6 4V8Z"></path>
                    <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Video APIs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Convert and compress videos via API</p>
                <a href="/api/video-conversion" className="text-purple-500 hover:text-purple-600 font-medium text-sm">View APIs →</a>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Document APIs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Convert and process documents via API</p>
                <a href="/api/document-conversion" className="text-red-500 hover:text-red-600 font-medium text-sm">View APIs →</a>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI APIs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">AI-powered enhancement via API</p>
                <a href="/api/remove-background" className="text-green-500 hover:text-green-600 font-medium text-sm">View APIs →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default HomePage;
