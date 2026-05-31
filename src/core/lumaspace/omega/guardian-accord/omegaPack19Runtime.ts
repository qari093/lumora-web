import { acceptAccord, createGuardianAccord } from "./accordEngine";
import { castCouncilVote, createGovernanceProposal, resolveProposal } from "./votingEngine";

export function runLumaSpaceOmegaMegaPack19Runtime() {
  let accord = createGuardianAccord("community-019", [
    { id: "r1", title: "Protect dignity", required: true },
    { id: "r2", title: "Explain decisions", required: true },
  ]);

  accord = acceptAccord(accord, "guardian-1");
  accord = acceptAccord(accord, "guardian-2");

  const proposal = createGovernanceProposal({
    id: "proposal-019",
    communityId: accord.communityId,
    title: "Open weekly circle",
  });

  const votes = [
    castCouncilVote({ communityId: accord.communityId, proposalId: proposal.id, voterId: "guardian-1", vote: "yes" }),
    castCouncilVote({ communityId: accord.communityId, proposalId: proposal.id, voterId: "guardian-2", vote: "yes" }),
  ];

  const resolved = resolveProposal(proposal, votes);

  return {
    ok: accord.active && accord.acceptedBy.length === 2 && resolved.status === "passed",
    accord,
    proposal,
    votes,
    resolved,
  };
}
