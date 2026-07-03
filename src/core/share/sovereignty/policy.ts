import type { CreatorRightsPolicy } from "./types";

export function createCreatorRightsPolicy(input: Partial<CreatorRightsPolicy> & {
  creatorId: string;
  objectId: string;
}): CreatorRightsPolicy {
  return {
    creatorId: input.creatorId,
    objectId: input.objectId,
    rights: input.rights ?? ["attribution", "license", "provenance", "audit", "revoke", "enforce"],
    licenseScopes: input.licenseScopes ?? ["private"],
    attributionRequired: input.attributionRequired ?? true,
    remixAllowed: input.remixAllowed ?? false,
    downloadAllowed: input.downloadAllowed ?? false,
    commercialUseAllowed: input.commercialUseAllowed ?? false,
    watermarkRequired: input.watermarkRequired ?? true,
    revocable: input.revocable ?? true,
  };
}

export function inheritCreatorRightsPolicy(
  parent: CreatorRightsPolicy,
  childObjectId: string,
  creatorId = parent.creatorId,
): CreatorRightsPolicy {
  return {
    ...parent,
    creatorId,
    objectId: childObjectId,
    attributionRequired: true,
    watermarkRequired: parent.watermarkRequired,
    commercialUseAllowed: parent.commercialUseAllowed && parent.licenseScopes.includes("commercial_allowed"),
    remixAllowed: parent.remixAllowed && !parent.licenseScopes.includes("no_derivatives"),
  };
}
