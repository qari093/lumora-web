import fs from "node:fs";
import { createVideoIngestionFoundationCertification } from "./runtime";

const requiredLocks = [
  ".lumora_video_ingestion_pack_01_lock",
  ".lumora_video_ingestion_pack_02_lock",
  ".lumora_video_ingestion_pack_03_lock",
  ".lumora_video_ingestion_pack_04_lock",
  ".lumora_video_ingestion_pack_05_lock",
  ".lumora_video_ingestion_pack_07_lock",
  ".lumora_video_ingestion_pack_08_lock",
  ".lumora_video_ingestion_pack_09_lock",
];

export function createVideoIngestionFinalAudit() {
  const certification = createVideoIngestionFoundationCertification();
  const lockChecks = requiredLocks.map((path) => ({
    path,
    exists: fs.existsSync(path),
  }));

  return {
    id: "video_ingestion_final_audit_v1",
    certification,
    lockChecks,
    passed:
      certification.passed &&
      lockChecks.every((lock) => lock.exists),
  };
}
