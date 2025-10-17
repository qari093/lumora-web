import type { NextApiRequest, NextApiResponse } from "next";

type Video = { kind:"video"; id:string; title:string; by:string; t?:number };
type Creator = { kind:"creator"; id:string; name:string; followers:number };
type Web = { kind:"web"; url:string; title:string; site:string };
type LumaResult = Video | Creator | Web;

type Resp = {
  source: "upstream" | "mock";
  query: string;
  results: LumaResult[];
  tabs: ("videos"|"creators"|"web")[];
  debug?: { upstream?: string; status?: number; error?: string }; // dev-only
};

const MOCK: Record<string, LumaResult[]> = {
  boxing: [
    { kind:"video", id:"v1", title:"Boxing footwork basics", by:"Coach A", t:37 },
    { kind:"creator", id:"c1", name:"FightLab", followers:128000 },
    { kind:"web", url:"https://www.expertboxing.com", title:"Footwork Guide", site:"expertboxing.com" }
  ],
  camera: [
    { kind:"video", id:"v2", title:"Beginner camera setup under $500", by:"LensPro", t:12 },
    { kind:"creator", id:"c2", name:"CineWave", followers:98000 },
    { kind:"web", url:"https://www.dpreview.com", title:"Best starter kits 2025", site:"dpreview.com" }
  ],
};

function fallback(q:string): LumaResult[] {
  return [
    { kind:"video", id:"v-demo", title:`Results for "${q}" (demo)`, by:"Lumora", t:5 },
    { kind:"creator", id:"c-demo", name:"Demo Creator", followers:12345 },
    { kind:"web", url:"https://en.wikipedia.org/wiki/Search_engine", title:"Search Engine (Wikipedia)", site:"wikipedia.org" }
  ];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  const q = String(req.query.q || "").toLowerCase().trim();
  const upstream = (process.env.LUMA_SEARCH_API || "").trim();
  const key = (process.env.LUMA_SEARCH_API_KEY || "").trim();
  const keyHeader = (process.env.LUMA_SEARCH_API_KEY_HEADER || "Authorization").trim();

  let debug: Resp["debug"] | undefined;

  if (upstream && q) {
    try {
      const url = upstream.includes("?")
        ? `${upstream}&q=${encodeURIComponent(q)}`
        : `${upstream}?q=${encodeURIComponent(q)}`;
      const headers: Record<string,string> = { accept: "application/json" };
      if (key) headers[keyHeader] = key;

      const r = await fetch(url, { headers });
      if (!r.ok) {
        debug = { upstream: url, status: r.status, error: `HTTP ${r.status}` };
        throw new Error(`Upstream ${r.status}`);
      }
      const data = await r.json();

      const arr: any[] =
        Array.isArray((data as any).results) ? (data as any).results :
        Array.isArray((data as any).items)   ? (data as any).items   : [];

      const results: LumaResult[] = arr.map((x:any) => {
        if (x.kind === "video")   return { kind:"video",   id:String(x.id||x.videoId), title:String(x.title||x.name||"Video"), by:String(x.by||x.author||x.channel||"Creator"), t:x.t ?? x.timestamp };
        if (x.kind === "creator") return { kind:"creator", id:String(x.id||x.creatorId), name:String(x.name||x.handle||"Creator"), followers:Number(x.followers||x.subscribers||0) };
        if (x.kind === "web")     return { kind:"web",     url:String(x.url||x.link),  title:String(x.title||x.name||"Link"),  site:String(x.site||x.domain||new URL(String(x.url||x.link)).hostname) };
        if (x.url || x.link)      return { kind:"web",     url:String(x.url||x.link),  title:String(x.title||"Link"),          site:String(x.site||x.domain||new URL(String(x.url||x.link)).hostname) };
        if (x.followers||x.handle)return { kind:"creator", id:String(x.id||x.handle||crypto.randomUUID()), name:String(x.name||x.handle||"Creator"), followers:Number(x.followers||0) };
        return { kind:"video", id:String(x.id||x.videoId||crypto.randomUUID()), title:String(x.title||"Video"), by:String(x.by||x.author||"Creator"), t:x.t ?? undefined };
      });

      return res.status(200).json({ source:"upstream", query:q, results, tabs:["videos","creators","web"], debug:{ upstream:url, status:200 } });
    } catch (e:any) {
      debug = debug || { upstream, error: String(e?.message || e) };
    }
  }

  const results = q ? (MOCK[q] || fallback(q)) : [];
  return res.status(200).json({ source:"mock", query:q, results, tabs:["videos","creators","web"], debug });
}
