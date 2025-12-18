/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vayva/ui", "@vayva/theme"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};
module.exports = nextConfig;
