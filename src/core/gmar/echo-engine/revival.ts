export type EchoRevival = {
  echoId: string;
  revived: boolean;
  celebration: "soft_reignite" | "none";
};

export function reviveEchoIfSquadReturns(
  echoId: string,
  originalSquadPresent: boolean,
): EchoRevival {
  return {
    echoId,
    revived: originalSquadPresent,
    celebration: originalSquadPresent ? "soft_reignite" : "none",
  };
}
