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

export type HarmonyEarnInput = {
  userId: string;
  baseAmount: number;
  note?: string;
  meta?: unknown;
  daysSinceSignup?: number;
};

export type HarmonySpendInput = {
  userId: string;
  amount: number;
  note?: string;
  meta?: unknown;
};

function normalizeEarnInput(
  userOrInput: string | HarmonyEarnInput,
  amount?: number,
  options?: {
    note?: string;
    meta?: unknown;
    daysSinceSignup?: number;
  },
): HarmonyEarnInput {
  if (typeof userOrInput === "string") {
    return {
      userId: userOrInput,
      baseAmount: Number(amount ?? 0),
      note: options?.note,
      meta: options?.meta,
      daysSinceSignup: options?.daysSinceSignup,
    };
  }

  return userOrInput;
}

function normalizeSpendInput(
  userOrInput: string | HarmonySpendInput,
  amount?: number,
  options?: {
    note?: string;
    meta?: unknown;
  },
): HarmonySpendInput {
  if (typeof userOrInput === "string") {
    return {
      userId: userOrInput,
      amount: Number(amount ?? 0),
      note: options?.note,
      meta: options?.meta,
    };
  }

  return userOrInput;
}

export async function earn(
  input: HarmonyEarnInput,
): Promise<HarmonyGrantResult>;
export async function earn(
  userId: string,
  amount: number,
  options?: {
    note?: string;
    meta?: unknown;
    daysSinceSignup?: number;
  },
): Promise<HarmonyGrantResult>;
export async function earn(
  userOrInput: string | HarmonyEarnInput,
  amount?: number,
  options?: {
    note?: string;
    meta?: unknown;
    daysSinceSignup?: number;
  },
): Promise<HarmonyGrantResult> {
  const input = normalizeEarnInput(userOrInput, amount, options);
  return grantHarmony(input.userId, input.baseAmount);
}

export async function spend(
  input: HarmonySpendInput,
): Promise<HarmonySpendResult>;
export async function spend(
  userId: string,
  amount: number,
  options?: {
    note?: string;
    meta?: unknown;
  },
): Promise<HarmonySpendResult>;
export async function spend(
  userOrInput: string | HarmonySpendInput,
  amount?: number,
  options?: {
    note?: string;
    meta?: unknown;
  },
): Promise<HarmonySpendResult> {
  const input = normalizeSpendInput(userOrInput, amount, options);
  return spendHarmony(input.userId, input.amount);
}

export async function statsToday() {
  return {
    earned: 0,
    spent: 0,
    balance: 0,
  };
}

export async function closeDay() {
  return {
    ok: true,
    earned: 0,
    spent: 0,
    balance: 0,
  };
}
