import type { LicenseFamily, RightsPolicy } from "./types";

export function createRightsPolicy(input: {
  id: string;
  family: LicenseFamily;
  allowCommercialUse?: boolean;
  allowDerivatives?: boolean;
  requireAttribution?: boolean;
  allowNativeIngestion?: boolean;
  allowEmbed?: boolean;
  allowFyp?: boolean;
  allowLumaSpace?: boolean;
  allowUniversalShare?: boolean;
  expiresAt?: string;
}): RightsPolicy {
  return {
    id: input.id,
    family: input.family,
    allowCommercialUse: input.allowCommercialUse ?? false,
    allowDerivatives: input.allowDerivatives ?? false,
    requireAttribution: input.requireAttribution ?? true,
    allowNativeIngestion: input.allowNativeIngestion ?? false,
    allowEmbed: input.allowEmbed ?? false,
    allowFyp: input.allowFyp ?? false,
    allowLumaSpace: input.allowLumaSpace ?? false,
    allowUniversalShare: input.allowUniversalShare ?? false,
    expiresAt: input.expiresAt,
  };
}

export function createOwnedRightsPolicy(id = "rights_owned_v1") {
  return createRightsPolicy({
    id,
    family: "owned",
    allowCommercialUse: true,
    allowDerivatives: true,
    requireAttribution: false,
    allowNativeIngestion: true,
    allowEmbed: true,
    allowFyp: true,
    allowLumaSpace: true,
    allowUniversalShare: true,
  });
}

export function createPublicDomainRightsPolicy(id = "rights_public_domain_v1") {
  return createRightsPolicy({
    id,
    family: "public_domain",
    allowCommercialUse: true,
    allowDerivatives: true,
    requireAttribution: true,
    allowNativeIngestion: true,
    allowEmbed: true,
    allowFyp: true,
    allowLumaSpace: true,
    allowUniversalShare: true,
  });
}

export function createEmbedOnlyRightsPolicy(id = "rights_embed_only_v1") {
  return createRightsPolicy({
    id,
    family: "embed_only",
    allowCommercialUse: false,
    allowDerivatives: false,
    requireAttribution: true,
    allowNativeIngestion: false,
    allowEmbed: true,
    allowFyp: false,
    allowLumaSpace: false,
    allowUniversalShare: true,
  });
}

export function createRestrictedRightsPolicy(id = "rights_restricted_v1") {
  return createRightsPolicy({
    id,
    family: "restricted",
    allowCommercialUse: false,
    allowDerivatives: false,
    requireAttribution: true,
    allowNativeIngestion: false,
    allowEmbed: false,
    allowFyp: false,
    allowLumaSpace: false,
    allowUniversalShare: false,
  });
}
