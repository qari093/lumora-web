export const ZENWALLET_RUNTIME = {
  system: "ZenWallet Flawless Global Ω∞",
  environment: process.env.NODE_ENV ?? "development",
  version: "1.0.0",
  telemetry: true,
  observability: true,
  featureFlags: true,
} as const;
