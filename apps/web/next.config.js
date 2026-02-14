/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@repo/ui", "@repo/types"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*", // Spring Boot backend
      },
    ];
  },
};

module.exports = nextConfig;
