import type { Fyp94ContentSource } from "../core/policy";
import type { Fyp94LicenseType } from "../supply/licenseRegistry";

export type Fyp94LicenseProof = {
  source: Fyp94ContentSource;
  licenseType: Fyp94LicenseType;
  licenseUrl: string;
  sourceUrl: string;
  capturedAt: string;
  commercialUseAllowed: boolean;
  modificationAllowed: boolean;
  attributionRequired: boolean;
  attributionText?: string;
};

export type Fyp94LegalAuditEvent = {
  assetId: string;
  action:
    | "license_validated"
    | "license_rejected"
    | "unsafe_content_blocked"
    | "proof_stored";
  reason?: string;
  at: string;
};
