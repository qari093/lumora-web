import { describe, expect, it } from "vitest";

import {
  LUMORA_PLATFORM_CONSTITUTION,
  LUMORA_PLATFORM_CONSTITUTION_ID,
  LUMORA_PLATFORM_CONSTITUTION_VERSION,
  constitutionLocked,
  getPlatformConstitution,
  validatePlatformConstitutionBaseline,
} from "@/src/core/governance/constitution";

import {
  creatorConstitutionEnabled,
  getConstitutionRuntimeState,
} from "@/src/core/constitution/runtime";

import {
  civilizationRuntimeEnabled,
  getCivilizationRuntimeState,
} from "@/src/core/civilization/runtime";

describe("Mega Step 27 platform constitutional baseline", () => {
  it("preserves the legacy constitution lock while establishing a canonical version", () => {
    expect(constitutionLocked).toBe(true);
    expect(LUMORA_PLATFORM_CONSTITUTION_ID).toBe(
      "lumora.platform.constitution",
    );
    expect(LUMORA_PLATFORM_CONSTITUTION_VERSION).toBe("1.0.0");
    expect(getPlatformConstitution()).toBe(LUMORA_PLATFORM_CONSTITUTION);
    expect(validatePlatformConstitutionBaseline()).toBe(true);
  });

  it("contains the irreducible fundamental-rights baseline", () => {
    expect(LUMORA_PLATFORM_CONSTITUTION.fundamentalRights).toEqual(
      expect.arrayContaining([
        "dignity",
        "equal_treatment",
        "privacy",
        "meaningful_explanation",
        "human_review",
        "remedy_and_appeal",
        "proportionality",
        "data_portability",
      ]),
    );

    expect(
      LUMORA_PLATFORM_CONSTITUTION.irreducibleBaseline
        .arbitraryActionForbidden,
    ).toBe(true);

    expect(
      LUMORA_PLATFORM_CONSTITUTION.irreducibleBaseline
        .consequentialAutomationRequiresHumanReviewPath,
    ).toBe(true);
  });

  it("requires a controlled amendment procedure", () => {
    const policy = LUMORA_PLATFORM_CONSTITUTION.amendmentPolicy;

    expect(policy.versionBumpRequired).toBe(true);
    expect(policy.publicChangeRecordRequired).toBe(true);
    expect(policy.reasonRequired).toBe(true);
    expect(policy.effectiveDateRequired).toBe(true);
    expect(policy.rightsImpactReviewRequired).toBe(true);
    expect(policy.conflictsOfInterestMustBeDisclosed).toBe(true);
    expect(policy.affectedPowerHolderCannotUnilaterallyVeto).toBe(true);
    expect(policy.publishedHistoryCannotBeSilentlyRewritten).toBe(true);
  });

  it("requires append-only and cryptographically sealed constitutional history", () => {
    const history = LUMORA_PLATFORM_CONSTITUTION.historyPolicy;

    expect(history.appendOnlyPublishedHistoryRequired).toBe(true);
    expect(history.immutablePublishedVersionIdentifiers).toBe(true);
    expect(history.cryptographicDigestRequiredForSealedVersions).toBe(true);
    expect(history.previousVersionReferenceRequired).toBe(true);
    expect(history.silentHistoryRewriteForbidden).toBe(true);
  });

  it("keeps community membership separate from legal citizenship and corporate authority", () => {
    const boundary = LUMORA_PLATFORM_CONSTITUTION.authorityBoundary;

    expect(boundary.communityMembershipIsNotLegalCitizenship).toBe(true);
    expect(boundary.communityGovernanceDoesNotCreateStateAuthority).toBe(true);
    expect(boundary.platformRemainsCommercialLegalEntity).toBe(true);
    expect(boundary.corporateLegalDutiesRemainWithAuthorizedLegalActors).toBe(
      true,
    );
  });

  it("prevents wealth, popularity and tokens from automatically becoming authority", () => {
    const boundary = LUMORA_PLATFORM_CONSTITUTION.authorityBoundary;
    const firewall = LUMORA_PLATFORM_CONSTITUTION.economicFirewall;

    expect(boundary.popularityDoesNotCreateAuthority).toBe(true);
    expect(boundary.wealthDoesNotCreateAuthority).toBe(true);
    expect(boundary.followerCountDoesNotCreateAuthority).toBe(true);
    expect(boundary.tokenBalanceDoesNotCreateAuthority).toBe(true);
    expect(firewall.moneyCannotPurchaseFundamentalRights).toBe(true);
    expect(firewall.tokensCannotAutomaticallyGrantGovernanceAuthority).toBe(
      true,
    );
  });

  it("connects legacy constitution and civilization runtime flags to the canonical contract", () => {
    expect(creatorConstitutionEnabled).toBe(true);
    expect(civilizationRuntimeEnabled).toBe(true);

    const constitutionRuntime = getConstitutionRuntimeState();
    expect(constitutionRuntime.enabled).toBe(true);
    expect(constitutionRuntime.constitutionVersion).toBe("1.0.0");
    expect(constitutionRuntime.amendmentProcedureRequired).toBe(true);
    expect(constitutionRuntime.appendOnlyHistoryRequired).toBe(true);

    const civilizationRuntime = getCivilizationRuntimeState();
    expect(civilizationRuntime.enabled).toBe(true);
    expect(civilizationRuntime.legalCitizenshipCreated).toBe(false);
    expect(civilizationRuntime.statehoodClaimed).toBe(false);
    expect(civilizationRuntime.sovereigntyClaimed).toBe(false);
  });
});
