import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { ThemeProvider } from './ThemeContext';

const Layout = ({ children, title, description, keywords, ogImage, canonical }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fullTitle = title ? `${title} | ImageOptimizer.in` : 'ImageOptimizer.in - The Ultimate All-in-One File Converter, Compressor & Optimizer';
  const fullDescription = description || 'Convert, compress, and optimize images, videos, PDFs, and more with our 300+ free online tools. Powered by AI technology.';
  const fullKeywords = keywords || 'image converter, video converter, pdf converter, file compression, image optimization, online tools, free converter';

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={fullDescription} />
        <meta name="keywords" content={fullKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ImageOptimizer.in" />
        <meta name="theme-color" content="#007BFF" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical || 'https://imageoptimizer.in'} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={fullDescription} />
        <meta property="og:image" content={ogImage || '/images/og-image.jpg'} />
        <meta property="og:site_name" content="ImageOptimizer.in" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical || 'https://imageoptimizer.in'} />
        <meta property="twitter:title" content={fullTitle} />
        <meta property="twitter:description" content={fullDescription} />
        <meta property="twitter:image" content={ogImage || '/images/og-image.jpg'} />
        
        {/* Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ImageOptimizer.in",
              "description": fullDescription,
              "url": "https://imageoptimizer.in",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "ImageOptimizer.in"
              }
            })
          }}
        />
      </Head>

      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </ThemeProvider>

      {/* Prevent hydration mismatch */}
      {!mounted && (
        <style jsx global>{`
          body {
            visibility: hidden;
          }
        `}</style>
      )}
    </>
  );
};

export default Layout;
