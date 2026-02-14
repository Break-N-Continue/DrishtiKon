/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/types"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL || "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
