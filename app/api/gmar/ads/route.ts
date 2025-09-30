export const runtime = "nodejs";
import { NextResponse } from "next/server";
const seen = new Map<string, number>(); // deviceId -> shown count
export async function GET(req:Request){
  const url = new URL(req.url); const gameId = url.searchParams.get("gameId")||"";
  const lang = url.searchParams.get("lang") || "en";
  const dev = (new Headers(req.headers)).get("x-device-id") || "dev-unknown";
  const n = (seen.get(dev)||0)+1; seen.set(dev,n);
  const variant = n % 3 === 0 ? "banner" : "holo";
  const products: Record<string,{title:string;line:string;price:number;currency:string}> = {
    en:{ title:"Creatine Pro Stack", line:"Click to buy • Ships today", price:29, currency:"€" },
    de:{ title:"Kreatin Pro Stack", line:"Jetzt kaufen • Versand heute", price:29, currency:"€" },
    es:{ title:"Creatina Pro Stack", line:"Comprar ahora • Envío hoy", price:29, currency:"€" }
  };
  const p = products[lang] || products["en"];
  return NextResponse.json({ ok:true, ad:{ ...p, variant, gameId } });
}
