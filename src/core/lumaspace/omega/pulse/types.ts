export type SignalKind =
  | "living_card_update"
  | "wisdom_beacon"
  | "mission_recap"
  | "celebration"
  | "community_highlight"
  | "memory_echo"
  | "bridge_invitation";

export type SignalAction = "send_light" | "resonate" | "weave" | "join_mission" | "open_bridge";

export type PulseSignal = {
  id: string;
  kind: SignalKind;
  creatorId: string;
  communityId?: string;
  title: string;
  emotionalWeight: number;
  trustScore: number;
  freshness: number;
  diversityKey: string;
  actions: SignalAction[];
  expiresAt: number;
};

export type PulseCycle = {
  citizenId: string;
  signals: PulseSignal[];
  maxSignals: number;
  completed: boolean;
  reflectionPrompt?: string;
};

export type PulseReflection = {
  citizenId: string;
  viewedSignals: number;
  prompt: string;
  suggestedActions: Array<"create_memory" | "send_light" | "open_vault" | "join_mission">;
};
