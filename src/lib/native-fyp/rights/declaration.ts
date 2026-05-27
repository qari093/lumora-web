import type { NativeFypRightsDeclaration, NativeFypLicenseType } from "./types";
import type { NativeFypSourceType } from "../policy";

export function createRightsDeclaration(input: {
  videoId: string;
  sourceType: NativeFypSourceType;
  licenseType: NativeFypLicenseType;
  declaredByUserId: string;
  expiresAt?: string;
  evidenceUrl?: string;
}): NativeFypRightsDeclaration {
  return {
    videoId: input.videoId,
    sourceType: input.sourceType,
    rightsStatus: "declared",
    licenseType: input.licenseType,
    declaredByUserId: input.declaredByUserId,
    declaredAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
    evidenceUrl: input.evidenceUrl,
  };
}
