export type AuthSessionProbe = {
  name: "valid_session" | "expired_session" | "missing_token" | "fingerprint_match";
  passed: boolean;
};

export type AuthSessionProductionSweepInput = {
  probes?: AuthSessionProbe[] | null;
};

export type AuthSessionProductionSweepResult =
  | {
      ok: true;
      sweep: {
        checked: number;
        passed: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const REQUIRED = new Set([
  "valid_session",
  "expired_session",
  "missing_token",
  "fingerprint_match",
]);

export function evaluateAuthSessionProductionSweep(
  input: AuthSessionProductionSweepInput
): AuthSessionProductionSweepResult {
  const probes = Array.isArray(input.probes) ? input.probes : [];
  if (probes.length === 0) return { ok: false, reason: "missing_probes" };

  const seen = new Set<string>();
  for (const probe of probes) {
    if (!REQUIRED.has(probe.name)) return { ok: false, reason: "invalid_probe" };
    if (seen.has(probe.name)) return { ok: false, reason: "duplicate_probe" };
    seen.add(probe.name);
  }

  for (const req of REQUIRED) {
    if (!seen.has(req)) return { ok: false, reason: "incomplete_probe_set" };
  }

  const passed = probes.filter((x) => x.passed).length;

  return {
    ok: true,
    sweep: {
      checked: probes.length,
      passed,
      ready: passed === probes.length,
    },
  };
}
