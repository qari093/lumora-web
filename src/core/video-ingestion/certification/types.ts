export type VideoIngestionCertificationStatus = "pass" | "fail";

export type VideoIngestionCertificationCheck = {
  id: string;
  label: string;
  status: VideoIngestionCertificationStatus;
  detail: string;
};

export type VideoIngestionFoundationCertification = {
  id: string;
  version: "video-ingestion-foundation.v1";
  createdAt: string;
  checks: VideoIngestionCertificationCheck[];
  passed: boolean;
  score: number;
};

export type VideoIngestionFoundationPack =
  | "runtime"
  | "providers"
  | "validation"
  | "rights"
  | "processing"
  | "emotion"
  | "health"
  | "store"
  | "bridge";
