export type RolloutGateScope =
  | "discovery"
  | "identity"
  | "mood-board"
  | "fandom-badge"
  | "user-control"
  | "habit"
  | "trust"
  | "system-health"
  | "ops";

export type RolloutGateStatus =
  | "draft"
  | "shadow"
  | "limited"
  | "live"
  | "paused";

export type RolloutGateRecord = {
  id: string;
  scope: RolloutGateScope;
  status: RolloutGateStatus;
  title: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export const ROLLOUT_GATE_REGISTRY: RolloutGateRecord[] = [];

export function registerRolloutGate(
  gate: RolloutGateRecord
): void {
  ROLLOUT_GATE_REGISTRY.push({
    ...gate,
    id: gate.id.trim(),
    title: gate.title.trim(),
  });
}

export function getRolloutGateById(
  id: string
): RolloutGateRecord | undefined {
  const normalizedId = id.trim();
  return ROLLOUT_GATE_REGISTRY.find((gate) => gate.id === normalizedId);
}

export function getActiveRolloutGates(): RolloutGateRecord[] {
  return ROLLOUT_GATE_REGISTRY.filter(
    (gate) => gate.status === "shadow" || gate.status === "limited" || gate.status === "live"
  );
}
