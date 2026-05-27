export type HostTransferResult = {
  ok: boolean;
  circleId: string;
  previousHostId?: string;
  newHostId?: string;
  reason: "transferred_to_keeper" | "host_present_no_transfer" | "missing_keeper";
};

export function transferHostToKeeper(input: {
  circleId: string;
  previousHostId?: string;
  hostMissing: boolean;
  keeperId?: string;
}): HostTransferResult {
  if (!input.hostMissing) {
    return {
      ok: true,
      circleId: input.circleId,
      previousHostId: input.previousHostId,
      newHostId: input.previousHostId,
      reason: "host_present_no_transfer",
    };
  }

  if (!input.keeperId) {
    return {
      ok: false,
      circleId: input.circleId,
      previousHostId: input.previousHostId,
      reason: "missing_keeper",
    };
  }

  return {
    ok: true,
    circleId: input.circleId,
    previousHostId: input.previousHostId,
    newHostId: input.keeperId,
    reason: "transferred_to_keeper",
  };
}
