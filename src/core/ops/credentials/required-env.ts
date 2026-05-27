export const requiredOperationalEnv = [
  "DATABASE_URL",
  "DATABASE_POOL_URL",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_CDN_URL",
  "EMAIL_PROVIDER_API_KEY",
  "EMAIL_FROM_DOMAIN",
  "EMAIL_FROM_ADDRESS",
  "AUTH_CLIENT_ID",
  "AUTH_CLIENT_SECRET",
  "AUTH_SESSION_SECRET",
  "LUMORA_ENCRYPTION_KEY",
  "UPLOAD_SIGNING_SECRET",
  "RATE_LIMIT_SECRET",
  "MONITORING_DSN",
] as const;

export function findMissingOperationalEnv(env: Record<string, string | undefined>) {
  return requiredOperationalEnv.filter((key) => !env[key] || env[key]?.includes("replace_me"));
}
