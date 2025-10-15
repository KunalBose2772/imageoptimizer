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
  Play,
  Download,
  Upload,
  Sparkles
} from 'lucide-react';

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
      <section className="relative overflow-hidden min-h-screen flex items-center">
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
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-4 mb-2 text-gray-900 dark:text-white">Lightning Fast Processing</h3>
                    <p className="text-body text-gray-600 dark:text-gray-300">
                      Our optimized infrastructure ensures your files are processed in under 3 seconds, 
                      making your workflow incredibly efficient.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-4 mb-2 text-gray-900 dark:text-white">AI-Powered Technology</h3>
                    <p className="text-body text-gray-600 dark:text-gray-300">
                      Advanced AI algorithms provide superior image enhancement and processing capabilities 
                      that traditional tools simply can't match.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-4 mb-2 text-gray-900 dark:text-white">100% Free Forever</h3>
                    <p className="text-body text-gray-600 dark:text-gray-300">
                      All our tools are completely free with no hidden costs, watermarks, or limitations. 
                      No credit card required.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-1">300+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tools Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-1">1M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-1">&lt;3s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-1">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
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
                <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-300">
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
                <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-green-500 transition-colors duration-300">
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
                <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors duration-300">
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
                <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors duration-300">
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
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
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
            <h2 className="heading-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-large max-w-2xl mx-auto">
              Got questions? We've got answers. Here are the most common questions about our platform.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="card p-6">
                  <h3 className="heading-4 mb-3">{faq.question}</h3>
                  <p className="text-body">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-2 text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-large text-blue-100 mb-8">
              Join millions of users who trust ImageOptimizer.in for their file conversion needs. 
              Start converting, compressing, and optimizing your files today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-500 hover:bg-gray-100 font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg flex items-center justify-center">
                Start Converting Now
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-500 font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg">
                View All Tools
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
