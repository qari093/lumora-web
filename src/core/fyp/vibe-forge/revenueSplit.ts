import type {
  RevenueSplit
} from "./types";

export function calculateRevenueSplit(input: {
  creatorIds: string[];
}): RevenueSplit[] {
  if (input.creatorIds.length === 0) {
    throw new Error("Revenue split requires creators.");
  }

  const split =
    Number(
      (100 / input.creatorIds.length).toFixed(2)
    );

  return input.creatorIds.map(id => ({
    creatorId: id,
    percentage: split
  }));
}
