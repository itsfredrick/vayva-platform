/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/shared", "@vayva/api-client", "@vayva/content"],
    serverExternalPackages: ["@prisma/client", "bcryptjs"]
};

module.exports = nextConfig;
