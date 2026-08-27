export type VersusCardReplayInput = {
  cardId: string;
  title: string;
  leftLabel: string;
  rightLabel: string;
  voteTimeline: Array<{
    atSeconds: number;
    leftVotes: number;
    rightVotes: number;
    label?: string;
  }>;
  resolvedAt: string;
};

export type VersusCardReplayCard = {
  id: string;
  type: "versus-replay";
  cardId: string;
  title: string;
  subtitle: string;
  keyMoments: Array<{
    atSeconds: number;
    label: string;
    lead: "left" | "right" | "tie";
  }>;
  resolvedAt: string;
};

export function buildVersusCardReplay(
  input: VersusCardReplayInput
): VersusCardReplayCard {
  const keyMoments: VersusCardReplayCard["keyMoments"] = input.voteTimeline
    .filter((m) => m.atSeconds >= 0)
    .slice(0, 6)
    .map((moment): VersusCardReplayCard["keyMoments"][number] => ({
      atSeconds: Math.round(moment.atSeconds),
      label:
        moment.label?.trim() ||
        `${input.leftLabel} ${moment.leftVotes} · ${input.rightLabel} ${moment.rightVotes}`,
      lead:
        moment.leftVotes === moment.rightVotes
          ? "tie"
          : moment.leftVotes > moment.rightVotes
          ? "left"
          : "right",
    }));

  return {
    id: `versus-replay:${input.cardId.trim()}`,
    type: "versus-replay",
    cardId: input.cardId.trim(),
    title: input.title.trim(),
    subtitle: `${input.leftLabel.trim()} vs ${input.rightLabel.trim()} replay`,
    keyMoments,
    resolvedAt: input.resolvedAt,
  };
}

export function isVersusCardReplayUsable(
  card: VersusCardReplayCard
): boolean {
  return (
    card.cardId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.keyMoments.length > 0
  );
}
