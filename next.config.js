/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable API routes
  // Removed trailingSlash and skipTrailingSlashRedirect as they're mainly for static exports
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig 