/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [ 'sharp', 'fs/promises', 'fs' ]
  }
}

module.exports = nextConfig
