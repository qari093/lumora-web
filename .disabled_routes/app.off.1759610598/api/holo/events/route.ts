import { NextResponse } from "next/server";
import { loadJson, saveJson, dataPath } from "../../../../lib/fsStore";
export const runtime = "nodejs";

type Event = { ts:string; type:"impression"|"click"|"purchase"; gameId?:string; adId?:string; meta?:any };
const FILE = dataPath("ads-events.json");

export async function POST(req:Request){
  const arr = await loadJson<Event[]>(FILE,[]);
  const body = await req.json().catch(()=>({}));
  arr.push({ ts:new Date().toISOString(), type: body.type || "impression", gameId: body.gameId, adId: body.adId, meta: body.meta });
  await saveJson(FILE,arr);
  return NextResponse.json({ ok:true, count: arr.length });
}
