export type AtmosphereSubscription = {
  subscriptionId: string;
  creatorId: string;
  fanId: string;
  mode: string;
  monthlyAmount: number;
  active: boolean;
};

export function createAtmosphereSubscription(input: {
  creatorId: string;
  fanId: string;
  mode: string;
  monthlyAmount: number;
}): AtmosphereSubscription {
  if (!input.creatorId.trim() || !input.fanId.trim() || !input.mode.trim()) {
    throw new Error("Atmosphere subscription requires creatorId, fanId, and mode.");
  }

  if (input.monthlyAmount < 1) {
    throw new Error("Atmosphere subscription amount too low.");
  }

  return {
    subscriptionId: `sub_${input.creatorId}_${input.fanId}_${input.mode}`,
    creatorId: input.creatorId,
    fanId: input.fanId,
    mode: input.mode,
    monthlyAmount: Number(input.monthlyAmount.toFixed(2)),
    active: true
  };
}
