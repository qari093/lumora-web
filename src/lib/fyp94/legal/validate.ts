import { assertFyp94SourceAllowed } from "../core/policy";
import { getFyp94LicenseRule } from "../supply/licenseRegistry";
import type { Fyp94LicenseProof } from "./types";

export function validateFyp94LicenseProof(proof: Fyp94LicenseProof): {
  ok: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  try {
    assertFyp94SourceAllowed(proof.source);
  } catch {
    reasons.push("source_not_allowed");
  }

  const rule = getFyp94LicenseRule(proof.licenseType);

  if (!proof.licenseUrl) reasons.push("missing_license_url");
  if (!proof.sourceUrl) reasons.push("missing_source_url");
  if (!proof.commercialUseAllowed || !rule.commercialUseAllowed) reasons.push("commercial_use_not_allowed");
  if (!proof.modificationAllowed || !rule.modificationAllowed) reasons.push("modification_not_allowed");

  if ((proof.attributionRequired || rule.attributionRequired) && !proof.attributionText) {
    reasons.push("missing_attribution");
  }

  return { ok: reasons.length === 0, reasons };
}

export function assertFyp94LegalIntake(proof: Fyp94LicenseProof): void {
  const result = validateFyp94LicenseProof(proof);
  if (!result.ok) {
    throw new Error(`FYP94 legal intake blocked: ${result.reasons.join(",")}`);
  }
}
