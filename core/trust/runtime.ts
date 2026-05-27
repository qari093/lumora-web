export type TQInput = {
  pledge?: number;
  retention?: number;
  safety?: number;
  transparency?: number;
  fairness?: number;
};

export function calculateTQ(input: TQInput = {}): number {
  const values = [
    Number(input.pledge ?? 0),
    Number(input.retention ?? 0),
    Number(input.safety ?? 0),
    Number(input.transparency ?? 0),
    Number(input.fairness ?? 0),
  ].filter((value) => Number.isFinite(value) && value > 0);

  if (values.length === 0) return 0;

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.max(0, Math.min(100, Math.round(average)));
}

export function trustRuntimeHealthy(): boolean {
  return true;
}

export const trustRuntime = {
  healthy: true,
  calculateTQ,
  trustRuntimeHealthy,
};

export default trustRuntime;
