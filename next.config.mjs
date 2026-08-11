import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** @type {import('next').NextConfig} */
const nextConfig = {
  
  
  experimental: { },
outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*",
      "./node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**/*",
      "./node_modules/.pnpm/prisma@*/node_modules/prisma/libquery_engine-rhel-openssl-3.0.x.so.node"
    ]
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
