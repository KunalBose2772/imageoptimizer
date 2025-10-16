/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Hostinger hosting
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimize for production
  swcMinify: true,
  compress: true,
  
  // Webpack configuration for hyperspeed package
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        bufferutil: false,
        'utf-8-validate': false,
        ws: false,
      };
    }
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Disable API routes for static export
  // API routes won't work with static export
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig
