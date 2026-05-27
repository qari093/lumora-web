import type {
  LegendaryRelicContract,
  MythicRelease
} from "./types";

export function createMythicRelease(input: {
  contract: LegendaryRelicContract;
  title: string;
}): MythicRelease {
  return {
    releaseId: `mythic_${input.contract.creatorId}`,
    creatorId: input.contract.creatorId,
    title: input.title,
    sponsored: true,
    relicDrop: true
  };
}
