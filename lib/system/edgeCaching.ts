export type CachePolicyInput = {
  path?: string | null;
  isStatic?: boolean | null;
  isPersonalized?: boolean | null;
  maxAgeSec?: number | null;
};

export type CachePolicyResult =
  | {
      ok: true;
      policy: {
        path: string;
        cacheable: boolean;
        ttl: number;
        strategy: "edge-cache" | "no-cache" | "private-cache";
      };
    }
  | { ok: false; reason: string };

export function resolveCachePolicy(input: CachePolicyInput): CachePolicyResult {
  const path = typeof input.path === "string" ? input.path.trim() : "";
  const isStatic = Boolean(input.isStatic);
  const isPersonalized = Boolean(input.isPersonalized);
  const maxAge =
    typeof input.maxAgeSec === "number" && Number.isFinite(input.maxAgeSec)
      ? Math.trunc(input.maxAgeSec)
      : NaN;

  if (!path || !path.startsWith("/")) return { ok: false, reason: "invalid_path" };
  if (!Number.isFinite(maxAge) || maxAge < 0) return { ok: false, reason: "invalid_max_age" };

  if (isPersonalized) {
    return {
      ok: true,
      policy: {
        path,
        cacheable: false,
        ttl: 0,
        strategy: "no-cache",
      },
    };
  }

  if (isStatic) {
    return {
      ok: true,
      policy: {
        path,
        cacheable: true,
        ttl: Math.max(maxAge, 3600),
        strategy: "edge-cache",
      },
    };
  }

  return {
    ok: true,
    policy: {
      path,
      cacheable: true,
      ttl: maxAge,
      strategy: "private-cache",
    },
  };
}
