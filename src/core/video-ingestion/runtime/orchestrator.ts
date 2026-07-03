import type { CanonicalVideoAsset } from "./types";
import { assertCanonicalVideoAsset } from "./validator";
import {
  attachAsset,
  createIngestionJob,
  transitionIngestionJob,
} from "./job";

export function runValidationPipeline(
  providerId: string,
  assets: CanonicalVideoAsset[],
) {
  let job = createIngestionJob(providerId);

  job = transitionIngestionJob(job, "discovering");
  job = transitionIngestionJob(job, "importing");

  const approved: CanonicalVideoAsset[] = [];

  for (const asset of assets) {
    const validated = assertCanonicalVideoAsset(asset);

    approved.push({
      ...validated,
      lifecycle: "validated",
      updatedAt: new Date().toISOString(),
    });

    job = attachAsset(job, validated.id);
  }

  job = transitionIngestionJob(job, "validated");
  job = transitionIngestionJob(job, "complete");

  return {
    ok: true,
    job,
    assets: approved,
  };
}
