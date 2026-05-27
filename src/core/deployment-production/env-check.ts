export const requiredCreatorShareEnv = [
  "DATABASE_URL",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
] as const;

export function checkMissingEnv(env: Record<string, string | undefined>) {
  return requiredCreatorShareEnv.filter((key) => !env[key]);
}
