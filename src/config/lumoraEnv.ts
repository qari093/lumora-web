export type LumoraEnv = "development" | "staging" | "production";

export const REQUIRED_ENV_KEYS = [
  "NEXT_PUBLIC_APP_ENV",
  "NEXT_PUBLIC_BASE_URL",
] as const;

export const OPTIONAL_ENV_KEYS = [
  "DATABASE_URL",
  "REDIS_URL",
  "SENTRY_DSN",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
] as const;
