/* ---------------------------------------------------------------------
   Hybrid Provider Bridge Layer (Phase 1) — SAFE, READY-TO-USE
   - Uses global fetch (Next.js/Node 18+)
   - Never emits invalid headers
   - Falls back to local placeholder on any provider error
------------------------------------------------------------------------*/

export type HybridType = "emoji" | "avatar";

export interface Provider {
  id: string;
  name: string;
  generate: (type: HybridType, text: string) => Promise<string>; // returns URL or dataURI
}

/** Build headers, adding Authorization only when a non-empty key exists */
function withAuth(base: Record<string, string>, bearerKey?: string | null) {
  const h: Record<string, string> = { ...base };
  if (bearerKey && bearerKey.trim()) h.authorization = `Bearer ${bearerKey}`;
  return h;
}

/** Local placeholder (always succeeds) */
const local: Provider = {
  id: "local",
  name: "Local Placeholder",
  async generate(type, text) {
    const safe = encodeURIComponent(text || "");
    return `/api/hybrid/placeholder/${type}?t=${safe}`;
  },
};

/** MirrorAI provider (requires MIRRORAI_API_KEY) */
const mirrorAI: Provider = {
  id: "mirrorai",
  name: "Mirror AI",
  async generate(type, text) {
    const key = process.env.MIRRORAI_API_KEY ?? "";
    if (!key) throw new Error("MirrorAI API key missing");

    const endpoint =
      type === "emoji"
        ? "https://api.mirror-ai.app/emoji"
        : "https://api.mirror-ai.app/avatar";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: withAuth({ "content-type": "application/json" }, key),
      body: JSON.stringify({ prompt: text }),
    });

    if (!res.ok) {
      const msg = await safeText(res);
      throw new Error(`MirrorAI ${type} failed (${res.status}): ${msg}`);
    }

    const data: any = await res.json();
    const out = data?.url || data?.image || data?.output?.[0];
    if (!out) throw new Error("MirrorAI returned no URL");
    return out;
  },
};

/** RenderX provider (requires RENDERX_API_KEY) */
const renderX: Provider = {
  id: "renderx",
  name: "RenderX API",
  async generate(type, text) {
    const key = process.env.RENDERX_API_KEY ?? "";
    if (!key) throw new Error("RenderX API key missing");

    const endpoint = "https://api.renderx.ai/v1/generate";
    const model = type === "emoji" ? "emoji-pro" : "avatar-v2";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: withAuth({ "content-type": "application/json" }, key),
      body: JSON.stringify({ model, prompt: text, size: "512x512" }),
    });

    if (!res.ok) {
      const msg = await safeText(res);
      throw new Error(`RenderX ${type} failed (${res.status}): ${msg}`);
    }

    const data: any = await res.json();
    const out = data?.output?.[0] || data?.url || data?.image;
    if (!out) throw new Error("RenderX returned no URL");
    return out;
  },
};

/** Registry */
const registry: Record<string, Provider> = {
  local,
  mirrorai: mirrorAI,
  renderx: renderX,
};

export function listProviders(): string[] {
  return Object.keys(registry);
}

export function getProvider(id?: string): Provider {
  return registry[id || "local"] || local;
}

/** Unified entry — falls back to local on any error */
export async function generateHybrid(
  type: HybridType,
  text: string,
  providerId?: string
) {
  const provider = getProvider(providerId);
  try {
    return await provider.generate(type, text);
  } catch (err: any) {
    console.warn(`⚠️ Provider failure (${provider.id}) → falling back to local: ${err?.message || err}`);
    return local.generate(type, text);
  }
}

/** Helpers */
async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "<no body>";
  }
}
/** Lightweight health snapshot (Phase 3) */
export async function healthSnapshot(){
  const emojiDefault = process.env.HYBRID_EMOJI_DEFAULT || "local";
  const avatarDefault = process.env.HYBRID_AVATAR_DEFAULT || "local";
  const freeDaily = Number(process.env.HYBRID_FREE_DAILY ?? 10);
  const rollover = String(process.env.HYBRID_CREDITS_ROLLOVER ?? "true") === "true";
  return {
    providers: listProviders(),
    defaults: { emoji: emojiDefault, avatar: avatarDefault },
    flags: {
      freeDaily,
      rollover,
      mirrorAI: Boolean(process.env.MIRRORAI_API_KEY),
      renderX: Boolean(process.env.RENDERX_API_KEY),
    },
    time: new Date().toISOString(),
  };
}
