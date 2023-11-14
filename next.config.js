//// @ts-check
/** @type {import('next').NextConfig} */
const myConfig = require('./public.config.json');
const dns = require("dns");

const defaultLang = myConfig.locale['default'];
dns.setDefaultResultOrder("ipv4first");

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  experimental: {
    serverComponentsExternalPackages: [ 'sharp', 'fs/promises', 'fs', 'bcrypt' ],
    //serverActions: true
  },
  images: {
    domains: [ process.env.APP_URL ],
  },
  rewrites: async () => {
    return [
      { source: '/', destination: '/ja' },
      { source: '/api/:path', destination: `/${ defaultLang }/api/:path` },
      { source: '/api/:path/:sub', destination: `/${ defaultLang }/api/:path/:sub` },
      { source: '/api/:path/:sub/:2nd', destination: `/${ defaultLang }/api/:path/:sub/:2nd` },
      { source: '/api/:path/:sub/:2nd/:3nd', destination: `/${ defaultLang }/api/:path/:sub/:2nd/:3nd` },
      { source: '/auth', destination: `/${ defaultLang }/auth` },
      { source: '/auth/:path', destination: `/${ defaultLang }/auth/:path` },
      { source: '/auth/:path/:2nd', destination: `/${ defaultLang }/auth/:path/:2nd` },
      { source: '/admin', destination: `/${ defaultLang }/admin` },
      { source: '/admin/:path', destination: `/${ defaultLang }/admin/:path` },
      { source: '/article', destination: `/${ defaultLang }/article` },
      { source: '/article/:path', destination: `/${ defaultLang }/article/:path` },
      { source: '/category', destination: `/${ defaultLang }/category` },
      { source: '/category/:path', destination: `/${ defaultLang }/category/:path` },
      { source: '/privacy-policy', destination: `/${ defaultLang }/privacy-policy` },
    ]
  }
}

module.exports = nextConfig;
