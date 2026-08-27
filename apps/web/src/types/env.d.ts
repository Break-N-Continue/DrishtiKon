/// <reference types="next" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** API Gateway base URL — set in Cloudflare Pages dashboard */
    NEXT_PUBLIC_API_URL?: string;
    /** Build target: "cloudflare" for static export, undefined for local dev */
    DEPLOY_TARGET?: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
