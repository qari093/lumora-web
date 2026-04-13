export type TerminalSealScope =
  | "final-wave"
  | "master-seal"
  | "launch-corridor"
  | "terminal-seal"
  | "full-canonical";

export type TerminalSealStatus =
  | "pending"
  | "armed"
  | "sealed"
  | "revoked";

export type TerminalSealRecord = {
  id: string;
  scope: TerminalSealScope;
  title: string;
  status: TerminalSealStatus;
  createdAt: string;
  updatedAt: string;
};

export const TERMINAL_SEAL_REGISTRY: TerminalSealRecord[] = [];

export function registerTerminalSeal(
  record: TerminalSealRecord
): void {
  TERMINAL_SEAL_REGISTRY.push({
    ...record,
    id: record.id.trim(),
    title: record.title.trim(),
  });
}

export function getTerminalSealById(
  id: string
): TerminalSealRecord | undefined {
  const normalizedId = id.trim();
  return TERMINAL_SEAL_REGISTRY.find((record) => record.id === normalizedId);
}

export function getActiveTerminalSeals(): TerminalSealRecord[] {
  return TERMINAL_SEAL_REGISTRY.filter(
    (record) => record.status === "armed" || record.status === "sealed"
  );
}
