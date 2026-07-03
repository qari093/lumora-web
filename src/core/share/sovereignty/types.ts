export type SovereigntyRight =
  | "attribution"
  | "license"
  | "remix"
  | "download"
  | "commercial_use"
  | "watermark"
  | "provenance"
  | "audit"
  | "revoke"
  | "enforce";

export type LicenseScope =
  | "private"
  | "friends"
  | "community"
  | "public_view"
  | "remix_allowed"
  | "commercial_allowed"
  | "no_derivatives";

export type CreatorRightsPolicy = {
  creatorId: string;
  objectId: string;
  rights: SovereigntyRight[];
  licenseScopes: LicenseScope[];
  attributionRequired: boolean;
  remixAllowed: boolean;
  downloadAllowed: boolean;
  commercialUseAllowed: boolean;
  watermarkRequired: boolean;
  revocable: boolean;
};

export type ProvenanceEntry = {
  id: string;
  objectId: string;
  actorId: string;
  action:
    | "created"
    | "shared"
    | "transformed"
    | "remixed"
    | "downloaded"
    | "licensed"
    | "revoked"
    | "enforced";
  parentObjectId?: string;
  at: string;
  hash: string;
};

export type SovereigntyDecision = {
  allowed: boolean;
  reason: string;
  requiredActions: string[];
};

export type RightsAuditLog = {
  id: string;
  objectId: string;
  actorId: string;
  decision: SovereigntyDecision;
  at: string;
};
