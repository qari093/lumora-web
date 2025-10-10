import * as harmony from "@/lib/econ/harmony";
import * as zen from "@/lib/econ/zen";

export type GameEventType =
  | "MATCH_WIN"
  | "MATCH_LOSS"
  | "QUEST_COMPLETE"
  | "ITEM_PURCHASE"
  | "REVIVE"
  | "DAILY_LOGIN";

export type GameEvent = {
  type: GameEventType;
  userId?: string;
  amount?: number;                // optional override (e.g., purchase price)
  note?: string;
  meta?: Record<string, unknown>;
};

type Action =
  | { kind: "PULSE_EARN"; amount: number; note?: string }
  | { kind: "PULSE_SPEND"; amount: number; note?: string }
  | { kind: "ZEN_CREDIT"; amount: number; note?: string }
  | { kind: "ZEN_DEBIT"; amount: number; note?: string };

// Default rule table (server-authoritative)
export const RULES: Record<GameEventType, Action[]> = {
  MATCH_WIN: [
    { kind: "PULSE_EARN", amount: 20, note: "win_bonus" },
    { kind: "ZEN_CREDIT", amount: 2, note: "win_bonus_converted" },
  ],
  MATCH_LOSS: [{ kind: "PULSE_EARN", amount: 5, note: "loss_consolation" }],
  QUEST_COMPLETE: [{ kind: "PULSE_EARN", amount: 30, note: "quest_reward" }],
  DAILY_LOGIN: [{ kind: "PULSE_EARN", amount: 10, note: "streak" }],

  // Client can pass `amount` to override the spend for ITEM_PURCHASE (pulse only).
  ITEM_PURCHASE: [
    { kind: "PULSE_SPEND", amount: 0, note: "item_buy" },
    { kind: "ZEN_DEBIT", amount: 1, note: "sink" },
  ],
  REVIVE: [{ kind: "PULSE_SPEND", amount: 8, note: "revive" }],
};

function clampInt(n: unknown, min = 0, max = 1_000_000) {
  const v = Math.floor(Number(n ?? 0));
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

export async function applyGameEvent(ev: GameEvent) {
  const userId = ev.userId || "demo-user";
  const rule = RULES[ev.type] ?? [];
  const override = clampInt(ev.amount, 0);

  // Allow dynamic override only for PULSE_SPEND on ITEM_PURCHASE (server guardrails)
  const actions = rule.map((a) => {
    if (ev.type === "ITEM_PURCHASE" && a.kind === "PULSE_SPEND" && override > 0) {
      return { ...a, amount: override };
    }
    return a;
  });

  const results: Array<
    | { kind: Action["kind"]; ok: true; detail: any }
    | { kind: Action["kind"]; ok: false; error: string }
  > = [];

  // Execute sequentially; isolate failures so one action doesn't break the rest
  for (const act of actions) {
    try {
      switch (act.kind) {
        case "PULSE_EARN": {
          const amount = clampInt(act.amount);
          const detail = await harmony.earn({
            userId,
            baseAmount: amount,
            note: act.note,
          });
          results.push({ kind: act.kind, ok: true, detail });
          break;
        }
        case "PULSE_SPEND": {
          const amount = clampInt(act.amount);
          const detail = await harmony.spend({ userId, amount, note: act.note });
          results.push({ kind: act.kind, ok: true, detail });
          break;
        }
        case "ZEN_CREDIT": {
          const amount = clampInt(act.amount);
          const detail = await zen.zenCredit(amount);
          results.push({ kind: act.kind, ok: true, detail });
          break;
        }
        case "ZEN_DEBIT": {
          const amount = clampInt(act.amount);
          const detail = await zen.zenDebit(amount);
          results.push({ kind: act.kind, ok: true, detail });
          break;
        }
      }
    } catch (e: any) {
      results.push({ kind: act.kind, ok: false, error: String(e?.message ?? e) });
    }
  }

  const zenSnap = await zen.snapshot();
  return {
    ok: results.every((r) => r.ok),
    event: { type: ev.type, userId, amount: ev.amount ?? null, note: ev.note ?? null },
    applied: actions,
    results,
    zen: zenSnap,
  };
}