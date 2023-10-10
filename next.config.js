//// @ts-check
/** @type {import('next').NextConfig} */
const myConfig = require('./public.config.json');

const defaultLang = myConfig.locale['default'];

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [ 'sharp', 'fs/promises', 'fs', 'bcrypt' ]
  },
  rewrites: async () => {
    return [
      { source: '/', destination: '/ja' },
      { source: '/api/:path', destination: `/${ defaultLang }/api/:path` },
      { source: '/api/:path/:sub', destination: `/${ defaultLang }/api/:path/:sub` },
      { source: '/api/:path/:sub/:2nd', destination: `/${ defaultLang }/api/:path/:sub/:2nd` },
      { source: '/auth', destination: `/${ defaultLang }/auth` },
      { source: '/auth/:path', destination: `/${ defaultLang }/auth/:path` },
      { source: '/auth/:path/:2nd', destination: `/${ defaultLang }/auth/:path/:2nd` },
      { source: '/admin', destination: `/${ defaultLang }/admin` },
      { source: '/admin/:path', destination: `/${ defaultLang }/admin/:path` }
    ]
  }
}

module.exports = nextConfig;
