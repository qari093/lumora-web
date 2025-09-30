// Unified search: Meilisearch when available, otherwise embedded MiniSearch.
import MiniSearch from "minisearch";

const NO_DOCKER = process.env.LUMORA_NO_DOCKER === "1";
type TrackDoc = { id:string; title:string; artist?:string; genre?:string; bpm?:number; url:string; lang?:string; niche?:string };

let mini: MiniSearch<TrackDoc> | null = null;
let meili: any = null; // defer dynamic import

export async function ensureIndex() {
  if (NO_DOCKER || !process.env.MEILI_HOST) {
    if (!mini) {
      mini = new MiniSearch<TrackDoc>({
        fields: ["title","artist","genre","lang","niche"],
        storeFields: ["id","title","artist","genre","bpm","url","lang","niche"],
        searchOptions: { prefix: true, fuzzy: 0.2 }
      });
    }
    return { type:"mini", index: mini };
  } else {
    if (!meili) {
      const { MeiliSearch } = await import("meilisearch");
      meili = new MeiliSearch({ host: process.env.MEILI_HOST!, apiKey: process.env.MEILI_MASTER_KEY! });
    }
    return { type:"meili", index: meili.index("tracks") };
  }
}

export async function addDocuments(docs: TrackDoc[]) {
  const { type, index } = await ensureIndex();
  if (type === "mini") {
    // Upsert: remove duplicates by id, then add
    const existing = new Map<string, TrackDoc>();
    (index as any).documents?.forEach?.((d:TrackDoc)=>existing.set(d.id,d));
    docs.forEach(d=>existing.set(d.id,d));
    (index as MiniSearch<TrackDoc>).removeAll();
    (index as MiniSearch<TrackDoc>).addAll([...existing.values()]);
    return { ok:true, type };
  } else {
    await (index as any).addDocuments(docs);
    return { ok:true, type };
  }
}

export async function searchDocs(q:string, opts:{ limit?:number; lang?:string; niche?:string }={}){
  const { type, index } = await ensureIndex();
  const limit = Math.min(opts.limit ?? 50, 200);
  if (type === "mini") {
    const res = (index as MiniSearch<TrackDoc>).search(q || "", { combineWith: "AND" }) as any[];
    let hits = res.map(r => r as any).map(h => h);
    // filter by facets if provided
    if (opts.lang) hits = hits.filter(h => h.lang === opts.lang);
    if (opts.niche) hits = hits.filter(h => h.niche === opts.niche);
    return { hits: hits.slice(0, limit) };
  } else {
    return await (index as any).search(q || "", {
      limit,
      filter: [
        opts.lang ? `lang = ${opts.lang}` : undefined,
        opts.niche ? `niche = ${opts.niche}` : undefined
      ].filter(Boolean)
    });
  }
}
