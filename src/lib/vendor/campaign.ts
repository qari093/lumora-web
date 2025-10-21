export type CampaignState = "draft" | "live" | "paused" | "ended";
export type Campaign = {
  id: string;
  ownerId: string;
  name: string;
  state: CampaignState;
  budgetEuros: number;        // target budget
  startAt?: number | null;    // ms
  endAt?: number | null;      // ms
  createdAt: number;
  updatedAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __CAMPAIGNS: Map<string, Campaign> | undefined;
}
const CAMPAIGNS: Map<string, Campaign> = (globalThis.__CAMPAIGNS ||= new Map());

function rid() { return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,10); }

export function createCampaign(input: { ownerId: string; name: string; budgetEuros: number; startAt?: number | null; endAt?: number | null }): Campaign {
  if (!input.ownerId || !input.name) throw new Error("BAD_REQUEST");
  const now = Date.now();
  const c: Campaign = {
    id: rid(),
    ownerId: input.ownerId,
    name: input.name,
    state: "draft",
    budgetEuros: +(input.budgetEuros || 0).toFixed(2),
    startAt: input.startAt ?? null,
    endAt: input.endAt ?? null,
    createdAt: now,
    updatedAt: now,
  };
  CAMPAIGNS.set(c.id, c);
  return c;
}

export function listCampaigns(ownerId: string): Campaign[] {
  return Array.from(CAMPAIGNS.values())
    .filter(c => c.ownerId === ownerId)
    .sort((a,b)=>a.createdAt-b.createdAt);
}

export function getCampaign(id: string): Campaign | undefined {
  return CAMPAIGNS.get(id);
}

export function patchCampaign(id: string, patch: Partial<Pick<Campaign,"name"|"budgetEuros"|"startAt"|"endAt">>): Campaign | null {
  const c = CAMPAIGNS.get(id); if (!c) return null;
  const now = Date.now();
  if (typeof patch.name === "string" && patch.name) c.name = patch.name;
  if (typeof patch.budgetEuros === "number" && isFinite(patch.budgetEuros) && patch.budgetEuros >= 0) c.budgetEuros = +patch.budgetEuros.toFixed(2);
  if (typeof patch.startAt === "number" || patch.startAt === null) c.startAt = patch.startAt ?? null;
  if (typeof patch.endAt === "number" || patch.endAt === null) c.endAt = patch.endAt ?? null;
  c.updatedAt = now; CAMPAIGNS.set(id, c);
  return c;
}

export function setState(id: string, action: "pause"|"resume"|"end"): Campaign | null {
  const c = CAMPAIGNS.get(id); if (!c) return null;
  if (action === "pause" && (c.state === "live")) c.state = "paused";
  else if (action === "resume" && (c.state === "paused" || c.state === "draft")) c.state = "live";
  else if (action === "end" && c.state !== "ended") c.state = "ended";
  c.updatedAt = Date.now(); CAMPAIGNS.set(id, c);
  return c;
}
