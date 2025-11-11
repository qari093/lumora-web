export type HarmonySnapshot = { balance: number; xp: number };
export type HarmonyGrantResult = { granted: number; balance: number; xp: number };
export type HarmonySpendResult = { ok: boolean; error?: string; balance: number };

export function getHarmonyState(_userId: string): HarmonySnapshot {
  return { balance: 0, xp: 0 };
}

export function grantHarmony(_userId: string, amount: number): HarmonyGrantResult {
  const granted = Number(amount || 0);
  return { granted, balance: granted, xp: granted };
}

export function spendHarmony(_userId: string, _amt: number): HarmonySpendResult {
  return { ok: true, balance: 0 };
}
