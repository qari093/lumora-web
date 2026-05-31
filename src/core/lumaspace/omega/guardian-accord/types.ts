export type AccordRule = {
  id: string;
  title: string;
  required: boolean;
};

export type GuardianAccord = {
  communityId: string;
  rules: AccordRule[];
  acceptedBy: string[];
  active: boolean;
};

export type CouncilVote = {
  id: string;
  communityId: string;
  voterId: string;
  proposalId: string;
  vote: "yes" | "no" | "abstain";
};

export type GovernanceProposal = {
  id: string;
  communityId: string;
  title: string;
  status: "open" | "passed" | "rejected";
};
