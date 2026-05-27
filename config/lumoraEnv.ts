export const REQUIRED_ENV_KEYS = [
  "DATABASE_URL",
] as const;

export const OPTIONAL_ENV_KEYS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_APP_URL",
] as const;

export type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];
export type OptionalEnvKey = (typeof OPTIONAL_ENV_KEYS)[number];

export function getLumoraEnv() {
  return {
    required: REQUIRED_ENV_KEYS,
    optional: OPTIONAL_ENV_KEYS,
  };
}
