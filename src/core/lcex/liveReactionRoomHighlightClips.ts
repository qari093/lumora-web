export type LiveReactionRoomHighlightClipInput = {
  roomId: string;
  entityId: string;
  title: string;
  moments: Array<{
    atSeconds: number;
    label: string;
    heatScore: number;
  }>;
  createdAt: string;
};

export type LiveReactionRoomHighlightClip = {
  id: string;
  roomId: string;
  entityId: string;
  title: string;
  topMoments: Array<{
    atSeconds: number;
    label: string;
    heatScore: number;
  }>;
  createdAt: string;
};

export function buildLiveReactionRoomHighlightClip(
  input: LiveReactionRoomHighlightClipInput
): LiveReactionRoomHighlightClip {
  const topMoments = [...input.moments]
    .filter((moment) => moment.atSeconds >= 0 && moment.label.trim().length > 0)
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, 5)
    .map((moment) => ({
      atSeconds: Math.max(0, Math.round(moment.atSeconds)),
      label: moment.label.trim(),
      heatScore: Math.max(0, Math.round(moment.heatScore)),
    }));

  return {
    id: `live-reaction-highlight:${input.roomId}:${Date.parse(input.createdAt) || Date.now()}`,
    roomId: input.roomId.trim(),
    entityId: input.entityId.trim(),
    title: input.title.trim(),
    topMoments,
    createdAt: input.createdAt,
  };
}

export function isLiveReactionRoomHighlightClipUsable(
  clip: LiveReactionRoomHighlightClip
): boolean {
  return (
    clip.roomId.length > 0 &&
    clip.entityId.length > 0 &&
    clip.title.length > 0 &&
    clip.topMoments.length > 0
  );
}
