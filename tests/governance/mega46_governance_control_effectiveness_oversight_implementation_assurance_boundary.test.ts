import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_CONTRACT,
  GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION,
  evaluateGovernanceControlEffectivenessAssurance,
  type AssuranceInput,
} from "../../src/core/governance/governanceControlEffectivenessAssuranceBoundary";

const valid = (patch: Partial<AssuranceInput> = {}): AssuranceInput => ({
  controlIdentifier: "rights-impact-review",
  declaredControlVersion: "mega37-v1",
  implementationEvidence: ["src/core/governance/rightsImpactReviewBoundary.ts"],
  validationEvidence: ["tests/governance/mega37_rights_impact_review_boundary.test.ts"],
  effectivenessState: "effective",
  implementationVerified: true,
  validationPassed: true,
  materialFailurePresent: false,
  escalationReference: null,
  reviewerUserId: "reviewer-1",
  implementationOwnerUserId: "owner-1",
  reviewerIndependentFromImplementationOwner: true,
  reviewerHasBoundedAuthority: true,
  selfCertificationRequested: false,
  consequentialFinding: true,
  humanReviewCompleted: true,
  auditReference: "audit://mega46/1",
  containsPublicSensitiveEvidence: false,
  authorityDerivedFromWealth: false,
  authorityDerivedFromPopularity: false,
  authorityDerivedFromFollowers: false,
  authorityDerivedFromTokens: false,
  claimsGovernmentalAuthority: false,
  claimsLegalCitizenship: false,
  claimsStatehood: false,
  claimsIndependentJurisdiction: false,
  ...patch,
});

describe("Mega46 governance control effectiveness assurance", () => {
  it("uses mega46-v1", () => {
    expect(GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION).toBe("mega46-v1");
  });

  it("authorizes fully evidenced effective control", () => {
    const r = evaluateGovernanceControlEffectivenessAssurance(valid());
    expect(r.authorized).toBe(true);
    expect(r.canCertifyEffective).toBe(true);
  });

  const cases: Array<[Partial<AssuranceInput>, string]> = [
    [{ controlIdentifier: "" }, "control_identifier_required"],
    [{ declaredControlVersion: "" }, "control_version_required"],
    [{ implementationEvidence: [] }, "implementation_evidence_required"],
    [{ validationEvidence: [] }, "validation_evidence_required"],
    [{ effectivenessState: null }, "effectiveness_state_required"],
    [{ implementationVerified: false }, "effective_state_without_success_evidence_blocked"],
    [{ validationPassed: false }, "effective_state_without_success_evidence_blocked"],
    [{ effectivenessState: "failed" }, "failed_control_cannot_be_certified_effective"],
    [{ effectivenessState: "unverified" }, "unverified_control_cannot_be_certified_effective"],
    [{ materialFailurePresent: true, escalationReference: "" }, "material_failure_escalation_required"],
    [{ reviewerUserId: "" }, "reviewer_identity_required"],
    [{ reviewerUserId: "same", implementationOwnerUserId: "same" }, "review_separation_required"],
    [{ reviewerIndependentFromImplementationOwner: false }, "review_separation_required"],
    [{ reviewerHasBoundedAuthority: false }, "review_separation_required"],
    [{ selfCertificationRequested: true }, "self_certification_blocked"],
    [{ humanReviewCompleted: false }, "human_review_required"],
    [{ auditReference: "" }, "audit_reference_required"],
    [{ containsPublicSensitiveEvidence: true }, "privacy_exposure_blocked"],
    [{ authorityDerivedFromWealth: true }, "economic_or_popularity_authority_blocked"],
    [{ authorityDerivedFromPopularity: true }, "economic_or_popularity_authority_blocked"],
    [{ authorityDerivedFromFollowers: true }, "economic_or_popularity_authority_blocked"],
    [{ authorityDerivedFromTokens: true }, "economic_or_popularity_authority_blocked"],
    [{ claimsGovernmentalAuthority: true }, "governmental_authority_claim_blocked"],
    [{ claimsLegalCitizenship: true }, "legal_citizenship_claim_blocked"],
    [{ claimsStatehood: true }, "statehood_claim_blocked"],
    [{ claimsIndependentJurisdiction: true }, "independent_jurisdiction_claim_blocked"],
  ];

  for (const [patch, reason] of cases) {
    it(reason, () => {
      const r = evaluateGovernanceControlEffectivenessAssurance(valid(patch));
      expect(r.authorized).toBe(false);
      expect(r.reason).toBe(reason);
    });
  }

  it("keeps degraded visible without certifying effective", () => {
    const r = evaluateGovernanceControlEffectivenessAssurance(
      valid({ effectivenessState: "degraded", validationPassed: false }),
    );
    expect(r.authorized).toBe(true);
    expect(r.canCertifyEffective).toBe(false);
  });

  it("preserves meta-governance safeguards", () => {
    const c = GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_CONTRACT;
    expect(c.paperComplianceIsInsufficient).toBe(true);
    expect(c.separatedReviewRequired).toBe(true);
    expect(c.unboundedSelfCertificationAllowed).toBe(false);
    expect(c.platformRemainsSubjectToApplicableLaw).toBe(true);
  });

  it("route is POST-only and admin authenticated", () => {
    const source = fs.readFileSync(
      "app/api/governance/control-effectiveness-assurance-boundary/route.ts",
      "utf8",
    );
    expect(source).toContain("export async function POST");
    expect(source).not.toContain("export async function GET");
    expect(source).toContain("requireAdminSession");
    expect(source).toContain("if (!auth.ok)");
  });
});
