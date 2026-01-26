/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS ? '/digital-logic-textbook' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/digital-logic-textbook/' : '',
};

module.exports = nextConfig;
