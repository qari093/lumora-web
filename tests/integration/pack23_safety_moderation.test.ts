import { describe, expect, it } from "vitest";
import {
  detectAbuse,
  detectAnomaly,
  preventManipulation,
  validateSignalIntegrity,
  validateTrustSystem,
} from "@/src/lib/integration/safety-moderation";

describe("Pack23 Safety & Moderation", () => {
  it("passes safety flow", () => {
    const abuse = detectAbuse({ duplicateSignals: 1 });
    const integrity = validateSignalIntegrity({ humanOnly: true });
    const anomaly = detectAnomaly({ ratePerMinute: 10 });
    const manipulation = preventManipulation({
      abusive: abuse.abusive,
      anomalous: anomaly.anomalous,
      signalIntegrityOk: integrity.ok,
    });

    expect(abuse.abusive).toBe(false);
    expect(integrity.ok).toBe(true);
    expect(anomaly.anomalous).toBe(false);
    expect(manipulation.allowed).toBe(true);
    expect(validateTrustSystem({ abuse, anomaly, manipulation }).ok).toBe(true);

    expect(detectAbuse({ duplicateSignals: 2 }).abusive).toBe(true);
    expect(validateSignalIntegrity({ humanOnly: true, inferredEmotion: true }).ok).toBe(false);
    expect(detectAnomaly({ ratePerMinute: 99 }).anomalous).toBe(true);
  });
});
