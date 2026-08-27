/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' output is for Docker. For Cloudflare Pages, we use 'export'.
  // Switch output based on target environment.
  output: process.env.DEPLOY_TARGET === "cloudflare" ? "export" : "standalone",

  // Trailing slashes required for static export hosting on Cloudflare Pages
  trailingSlash: process.env.DEPLOY_TARGET === "cloudflare",

  // Image optimization is not available in static export — use unoptimized images.
  images: {
    unoptimized: process.env.DEPLOY_TARGET === "cloudflare",
  },

  // API proxy rewrites work in standalone mode (local/Docker dev).
  // In Cloudflare Pages static export, the frontend calls the Lambda API directly.
  ...(process.env.DEPLOY_TARGET !== "cloudflare" && {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.API_BASE_URL || "http://localhost:8080"}/api/:path*`,
        },
      ];
    },
  }),

  env: {
    // In production (Cloudflare Pages), NEXT_PUBLIC_API_URL points to the
    // AWS Lambda HTTP API Gateway URL, set via Cloudflare Pages env vars.
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  },
};

module.exports = nextConfig;
