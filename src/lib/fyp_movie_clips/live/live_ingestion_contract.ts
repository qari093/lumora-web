import { buildLicenseProof } from "../license_guard";
import type { LiveArchiveCandidate } from "./archive_candidate_builder";

export function validateCandidateBeforeDownload(candidate: LiveArchiveCandidate) {
  const proof = buildLicenseProof({
    sourceId: candidate.sourceId,
    sourceUrl: candidate.sourceUrl,
    license: candidate.license || "public domain",
  });

  return {
    ok: proof.safe && candidate.downloadUrl.endsWith(".mp4"),
    proof,
  };
}
