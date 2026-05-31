import type { PulseSignal, SignalAction, SignalKind } from "./types";

const ACTIONS_BY_KIND: Record<SignalKind, SignalAction[]> = {
  living_card_update: ["send_light", "resonate", "weave"],
  wisdom_beacon: ["send_light", "resonate", "weave"],
  mission_recap: ["send_light", "join_mission", "weave"],
  celebration: ["send_light", "resonate", "weave"],
  community_highlight: ["send_light", "open_bridge", "weave"],
  memory_echo: ["send_light", "resonate", "weave"],
  bridge_invitation: ["open_bridge", "send_light"],
};

export function createPulseSignal(input: {
  id: string;
  kind: SignalKind;
  creatorId: string;
  communityId?: string;
  title: string;
  emotionalWeight: number;
  trustScore: number;
  freshness: number;
  diversityKey: string;
  expiresInMs?: number;
}): PulseSignal {
  if (!input.id.trim()) throw new Error("signal_id_required");
  if (!input.creatorId.trim()) throw new Error("creatorId_required");
  if (!input.title.trim()) throw new Error("signal_title_required");

  return {
    id: input.id,
    kind: input.kind,
    creatorId: input.creatorId,
    communityId: input.communityId,
    title: input.title,
    emotionalWeight: Math.max(0, Math.min(100, input.emotionalWeight)),
    trustScore: Math.max(0, Math.min(100, input.trustScore)),
    freshness: Math.max(0, Math.min(100, input.freshness)),
    diversityKey: input.diversityKey,
    actions: ACTIONS_BY_KIND[input.kind],
    expiresAt: Date.now() + (input.expiresInMs ?? 1000 * 60 * 60 * 24),
  };
}

export function isSignalActive(signal: PulseSignal, now = Date.now()): boolean {
  return signal.expiresAt > now;
}
