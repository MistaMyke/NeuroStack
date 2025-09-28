/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  transpilePackages: ['@cpa/shared-types', '@cpa/ui-library'],
};

module.exports = config;
