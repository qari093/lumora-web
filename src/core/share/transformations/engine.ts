import type { UniversalShareObject } from "../foundation/types";
import { getCrossPortalAdapter } from "./registry";
import type { CrossPortalTarget, CrossPortalTransformation } from "./types";

export function transformShareForPortal(
  share: UniversalShareObject,
  targetPortal: CrossPortalTarget,
): CrossPortalTransformation {
  return getCrossPortalAdapter(targetPortal).transform(share);
}

export function transformShareAcrossPortals(
  share: UniversalShareObject,
  targetPortals: CrossPortalTarget[],
): CrossPortalTransformation[] {
  const uniqueTargets = Array.from(new Set(targetPortals));
  return uniqueTargets.map((targetPortal) => transformShareForPortal(share, targetPortal));
}

export function createTransformationManifest(transformations: CrossPortalTransformation[]) {
  return {
    version: "usl-cross-portal-v1",
    count: transformations.length,
    identityPreserved: transformations.every((item) => item.identityPreserved),
    targets: transformations.map((item) => item.targetPortal),
    artifacts: transformations.map((item) => item.artifactKind),
  };
}
