/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Note: custom 'headers' not supported with output:export
  // Security headers are applied via public/_headers (Cloudflare Pages)
};

module.exports = nextConfig;
