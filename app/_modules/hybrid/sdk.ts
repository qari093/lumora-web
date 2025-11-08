// Lightweight client SDK for Hybrid Emoji + Avatar

export type HybridType = "emoji" | "avatar";

export type GenResp = {
  ok: boolean;
  type?: HybridType;
  provider?: string;
  url?: string;
  error?: string;
};

type ProvidersResp = {
  ok: boolean;
  cfg: {
    emoji: { default: string; providers: string[] };
    avatar: { default: string; providers: string[] };
    flags: {
      freeDaily: number;
      rollover: boolean;
      mirrorAI: boolean;
      renderX: boolean;
    };
  };
};

type CreditsGetResp = {
  ok: boolean;
  user: string;
  credits: number;
  updated: string;
};

type CreditsPostResp = {
  ok: boolean;
  user: string;
  credits: number;
  cost: number;
  updated: string;
};

async function j<T = any>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = "";
    try {
      msg = await res.text();
    } catch {}
    throw new Error(`HTTP ${res.status} ${res.statusText} ${msg ? "- " + msg : ""}`);
  }
  return (await res.json()) as T;
}

/** GET /api/hybrid/providers */
export async function getProviders(): Promise<ProvidersResp["cfg"]> {
  const r = await fetch("/api/hybrid/providers", { cache: "no-store" });
  const data = await j<ProvidersResp>(r);
  if (!data.ok) throw new Error("providers not ok");
  return data.cfg;
}

/** GET /api/hybrid/credits?user=... */
export async function getCredits(user: string): Promise<CreditsGetResp> {
  const r = await fetch(`/api/hybrid/credits?user=${encodeURIComponent(user)}`, {
    cache: "no-store",
  });
  return j<CreditsGetResp>(r);
}

/** POST /api/hybrid/credits { user, cost } */
export async function spendCredits(user: string, cost: number): Promise<CreditsPostResp> {
  const r = await fetch("/api/hybrid/credits", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user, cost }),
  });
  return j<CreditsPostResp>(r);
}

/** POST /api/hybrid/generate { type, text, provider? } */
export async function generate(
  type: HybridType,
  text: string,
  provider?: string
): Promise<GenResp> {
  const r = await fetch("/api/hybrid/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type, text, provider }),
  });
  return j<GenResp>(r);
}