export type ConsentInput = {
  userId?: string | null;
  analytics?: boolean | null;
  ads?: boolean | null;
  personalization?: boolean | null;
  updatedAt?: number | null;
};

export type ConsentRecord = {
  userId: string;
  analytics: boolean;
  ads: boolean;
  personalization: boolean;
  updatedAt: number;
};

export type ConsentResult =
  | { ok: true; consent: ConsentRecord }
  | { ok: false; reason: string };

export function buildConsentStub(
  input: ConsentInput,
  now: number = Date.now()
): ConsentResult {
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";
  const updatedAt =
    typeof input.updatedAt === "number" && Number.isFinite(input.updatedAt) && input.updatedAt > 0
      ? Math.trunc(input.updatedAt)
      : now;

  if (!userId) return { ok: false, reason: "missing_user_id" };

  return {
    ok: true,
    consent: {
      userId,
      analytics: Boolean(input.analytics),
      ads: Boolean(input.ads),
      personalization: Boolean(input.personalization),
      updatedAt,
    },
  };
}
