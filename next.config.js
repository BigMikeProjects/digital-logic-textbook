/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_ACTIONS ? '/digital-logic-textbook' : '';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
