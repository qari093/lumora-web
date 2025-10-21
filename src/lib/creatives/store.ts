export type Creative = {
  id: string;
  ownerId: string;
  title: string;
  image: string;     // /static/... or https://...
  actionUrl: string; // https://...
  createdAt: number;
  updatedAt: number;
};
declare global { var __CREATIVES: Map<string, Creative> | undefined; }
const DB: Map<string, Creative> = (globalThis.__CREATIVES ||= new Map());
function rid(){ return Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10); }

export function createCreative(input: {ownerId:string; title:string; image:string; actionUrl:string}): Creative {
  const now = Date.now();
  const c: Creative = { id: rid(), ownerId: input.ownerId, title: input.title, image: input.image, actionUrl: input.actionUrl, createdAt: now, updatedAt: now };
  DB.set(c.id, c); return c;
}
export function listCreatives(ownerId: string): Creative[] {
  return Array.from(DB.values()).filter(c=>c.ownerId===ownerId).sort((a,b)=>a.createdAt-b.createdAt);
}
export function getCreative(id: string){ return DB.get(id); }
export function updateCreative(id: string, patch: Partial<Pick<Creative,"title"|"image"|"actionUrl">>): Creative | null {
  const c = DB.get(id); if(!c) return null;
  if (typeof patch.title === "string" && patch.title.trim()) c.title = patch.title.trim();
  if (typeof patch.image === "string" && patch.image.trim()) c.image = patch.image.trim();
  if (typeof patch.actionUrl === "string" && patch.actionUrl.trim()) c.actionUrl = patch.actionUrl.trim();
  c.updatedAt = Date.now(); DB.set(id,c); return c;
}
