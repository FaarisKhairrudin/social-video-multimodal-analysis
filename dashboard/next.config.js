/** @type {import('next').NextConfig} */

// Environment check for production vs development
const isProd = process.env.NODE_ENV === 'production';
const repo = 'social-video-insights-dashboard';

const nextConfig = {
  // Configuration for static export (GitHub Pages)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Only use basePath and assetPrefix in production (GitHub Pages)
  // In development, these should be empty for local dev server
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}` : ''
}

module.exports = nextConfig