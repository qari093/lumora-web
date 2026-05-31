import { describe, expect, it } from "vitest";
import { acceptAccord, createGuardianAccord } from "@/src/core/lumaspace/omega/guardian-accord/accordEngine";
import { castCouncilVote, createGovernanceProposal, resolveProposal } from "@/src/core/lumaspace/omega/guardian-accord/votingEngine";
import { runLumaSpaceOmegaMegaPack19Runtime } from "@/src/core/lumaspace/omega/guardian-accord/omegaPack19Runtime";

describe("LumaSpace Ω∞ Mega Pack 19 — Guardian Accord", () => {
  it("creates and accepts accord", () => {
    let accord = createGuardianAccord("c1", [{ id: "r1", title: "Rule", required: true }]);
    accord = acceptAccord(accord, "g1");

    expect(accord.active).toBe(true);
    expect(accord.acceptedBy).toContain("g1");
  });

  it("passes governance proposal", () => {
    const proposal = createGovernanceProposal({ id: "p1", communityId: "c1", title: "Proposal" });
    const vote = castCouncilVote({ communityId: "c1", proposalId: "p1", voterId: "g1", vote: "yes" });

    expect(resolveProposal(proposal, [vote]).status).toBe("passed");
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack19Runtime().ok).toBe(true);
  });
});
