/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [ 'sharp', 'fs/promises', 'fs', 'bcrypt' ]
  },
  rewrites: async () => {
    return [
      { source: '/', destination: '/ja' },
      { source: '/api/:path', destination: '/ja/api/:path' },
      { source: '/api/:path/:sub', destination: '/ja/api/:path/:sub' },
      { source: '/api/:path/:sub/:2nd', destination: '/ja/api/:path/:sub/:2nd' },
      { source: '/auth', destination: '/ja/auth' },
      { source: '/auth/:path', destination: '/ja/auth/:path' },
      { source: '/auth/:path/:2nd', destination: '/ja/auth/:path/:2nd' },
      { source: '/admin', destination: '/ja/admin' },
      { source: '/admin/:path', destination: '/ja/admin/:path' }
    ]
  }
}

module.exports = nextConfig;
