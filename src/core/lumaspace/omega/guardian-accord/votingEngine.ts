import type { CouncilVote, GovernanceProposal } from "./types";

export function createGovernanceProposal(input: {
  id: string;
  communityId: string;
  title: string;
}): GovernanceProposal {
  return {
    id: input.id,
    communityId: input.communityId,
    title: input.title,
    status: "open",
  };
}

export function castCouncilVote(input: {
  communityId: string;
  voterId: string;
  proposalId: string;
  vote: CouncilVote["vote"];
}): CouncilVote {
  return {
    id: `vote_${input.proposalId}_${input.voterId}`,
    communityId: input.communityId,
    voterId: input.voterId,
    proposalId: input.proposalId,
    vote: input.vote,
  };
}

export function resolveProposal(proposal: GovernanceProposal, votes: CouncilVote[]): GovernanceProposal {
  const yes = votes.filter((vote) => vote.vote === "yes").length;
  const no = votes.filter((vote) => vote.vote === "no").length;
  return { ...proposal, status: yes > no ? "passed" : "rejected" };
}
