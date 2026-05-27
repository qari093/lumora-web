export type LiveAlchemyMode =
  | "constellation_room"
  | "silent_audience"
  | "dream_chamber"
  | "bridge_event"
  | "shadow_circle"
  | "sanctuary_live";

export interface LiveAlchemyRoom {
  id: string;
  constellation: string;
  mode: LiveAlchemyMode;
  hostCreatorId: string;
  activeViewers: number;
  likesHidden: boolean;
  commentsHidden: boolean;
  quietGiftsEnabled: boolean;
  moderationEnabled: boolean;
}

export interface LiveResonanceSignal {
  roomId: string;
  silentViewers: number;
  quietGifts: number;
  lingerSecondsAvg: number;
  emotionalSafetyScore: number;
}

export interface LiveRitualDecision {
  allowed: boolean;
  ritual: LiveAlchemyMode;
  reason: string;
}
