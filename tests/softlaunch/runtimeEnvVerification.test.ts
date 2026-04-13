import { describe, expect, it } from "vitest";
import { verifyRuntimeEnv } from "@/lib/softlaunch/runtimeEnvVerification";

const base = {
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

describe("soft-launch runtime env + secrets verification", () => {
  it("passes when all env values match", () => {
    const out = verifyRuntimeEnv({ values: base });
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.valid).toBe(true);
      expect(out.verification.checked).toBe(13);
    }
  });

  it("fails when one env value is wrong", () => {
    const out = verifyRuntimeEnv({
      values: { ...base, LUMORA_INTERNAL_ADS_MODE: "controlled" },
    });
    expect(out).toEqual({ ok: false, reason: "env_mismatch:LUMORA_INTERNAL_ADS_MODE" });
  });

  it("fails when a value is missing", () => {
    const copy = { ...base };
    delete (copy as any).NEXT_PUBLIC_APP_URL;
    const out = verifyRuntimeEnv({ values: copy });
    expect(out).toEqual({ ok: false, reason: "env_mismatch:NEXT_PUBLIC_APP_URL" });
  });

  it("fails when secret status is absent", () => {
    const out = verifyRuntimeEnv({
      values: { ...base, LUMORA_RUNTIME_SECRET_STATUS: "" },
    });
    expect(out).toEqual({ ok: false, reason: "env_mismatch:LUMORA_RUNTIME_SECRET_STATUS" });
  });
});
