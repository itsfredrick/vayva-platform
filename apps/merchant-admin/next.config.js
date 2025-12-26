/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/shared", "@vayva/api-client", "@vayva/content"],
    experimental: {
        turbopack: {
            root: "../../"
        }
    }
};

module.exports = nextConfig;
