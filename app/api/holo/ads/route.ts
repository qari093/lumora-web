import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ADS = [
  { id:"creatine3d", title:"3D Creatine • Lab-tested", desc:"Performance boost for athletes.", price:"€29", img:"/ads/product.png", niche:["strength","endurance"], lang:{ en:"3D Creatine • Lab-tested", de:"3D Kreatin • Laborgeprüft" } },
  { id:"whey_vanilla", title:"Whey Vanilla", desc:"Premium protein blend.", price:"€24", img:"/ads/product.png", niche:["strength","focus"], lang:{ en:"Whey Vanilla", de:"Whey Vanille" } },
  { id:"focus_caps", title:"Focus Caps", desc:"Stay sharp and alert.", price:"€19", img:"/ads/product.png", niche:["focus"], lang:{ en:"Focus Caps", de:"Fokus Kapseln" } }
];

function pickLang(headers: Headers){
  const cookie = headers.get("cookie") || "";
  const m = cookie.match(/(?:^|; )lang=([^;]+)/);
  return (m && decodeURIComponent(m[1])) || "en";
}

export async function GET(req:Request){
  const { searchParams } = new URL(req.url);
  const niche = (searchParams.get("niche") || "").toLowerCase();
  const lang = pickLang(new Headers(req.headers));
  const set = ADS.filter(a => niche ? a.niche.includes(niche) : true);
  const mapped = set.map(a => ({ ...a, title: a.lang?.[lang] || a.title }));
  return NextResponse.json({ ok:true, items: mapped });
}
