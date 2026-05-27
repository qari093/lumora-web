import type {
  ConstellationMember,
  ConstellationRole
} from "./types";

export function assignConstellationRole(input: {
  creatorId: string;
  role: ConstellationRole;
  joinedAt: number;
}): ConstellationMember {
  if (!input.creatorId.trim()) {
    throw new Error("Constellation role requires creatorId.");
  }

  return {
    creatorId: input.creatorId,
    role: input.role,
    joinedAt: input.joinedAt
  };
}
