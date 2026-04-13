export type RuntimeEnvVerificationInput = {
  values?: Record<string, string | undefined> | null;
};

export type RuntimeEnvVerificationResult =
  | {
      ok: true;
      verification: {
        checked: number;
        valid: boolean;
      };
    }
  | { ok: false; reason: string };

const REQUIRED: Record<string, string> = {
  NODE_ENV: "production",
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_APP_URL: "https://lumora.app",
  LUMORA_PRIVATE_BETA_ENABLED: "1",
  LUMORA_WAITLIST_ENABLED: "1",
  LUMORA_TESTER_ACCESS_MODE: "allowlist",
  LUMORA_SOFTLAUNCH_MODE: "1",
  LUMORA_FYP_ADS_ENABLED: "0",
  LUMORA_INTERNAL_ADS_ENABLED: "1",
  LUMORA_INTERNAL_ADS_MODE: "shadow",
  LUMORA_CREATOR_REVIEW_REQUIRED: "1",
  LUMORA_KYC_REVIEW_MODE: "manual",
  LUMORA_RUNTIME_SECRET_STATUS: "present",
};

export function verifyRuntimeEnv(
  input: RuntimeEnvVerificationInput
): RuntimeEnvVerificationResult {
  const values = input.values ?? {};

  for (const [key, expected] of Object.entries(REQUIRED)) {
    if ((values[key] ?? "") !== expected) {
      return { ok: false, reason: `env_mismatch:${key}` };
    }
  }

  return {
    ok: true,
    verification: {
      checked: Object.keys(REQUIRED).length,
      valid: true,
    },
  };
}
