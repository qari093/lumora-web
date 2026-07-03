export type VideoProviderKind =
  | "genesis"
  | "trusted_stock"
  | "wonder"
  | "memory_archive"
  | "community"
  | "embed"
  | "owned"
  | "partner";

export type VideoLifecycle =
  | "discovered"
  | "imported"
  | "validated"
  | "approved"
  | "quarantined"
  | "archived";

export type VideoLicense = {
  id: string;
  label: string;
  commercialUse: boolean;
  derivativesAllowed: boolean;
  attributionRequired: boolean;
  sourceUrl: string;
  verifiedAt: string;
};

export type CanonicalVideoAsset = {
  id: string;
  version: "uvip.v1";
  providerId: string;
  sourceAssetId: string;
  sourceUrl: string;
  title: string;
  description?: string;
  durationSeconds: number;
  width: number;
  height: number;
  hasAudio: boolean;
  mimeType: string;
  license: VideoLicense;
  attribution: string;
  checksum: string;
  lifecycle: VideoLifecycle;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type VideoProvider = {
  id: string;
  label: string;
  kind: VideoProviderKind;
  enabled: boolean;
  priority: number;
  constitutionId: string;
};
