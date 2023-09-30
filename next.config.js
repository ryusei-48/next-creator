/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [ 'sharp', 'fs/promises', 'fs' ]
  },
  rewrites: async () => {
    return [
      { source: '/', destination: '/ja' },
      { source: '/api/:path', destination: '/ja/api/:path' },
      { source: '/api/:path/:sub', destination: '/ja/api/:path/:sub' },
      { source: '/admin', destination: '/ja/admin' },
      { source: '/admin/:path', destination: '/ja/admin/:path' }
    ]
  }
}

module.exports = nextConfig;
