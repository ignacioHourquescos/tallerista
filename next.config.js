const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  env: {
    API_URL: process.env.API_URL,
  },
  transpilePackages: ['antd-mobile'],
  webpack: (config, { dev, isServer }) => {
    if (!isServer && !dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== 'WorkboxWebpackPlugin'
      );
    }
    return config;
  },
});

module.exports = nextConfig;
