import { NextRequest } from "next/server";
import { loadStore } from "@/lib/ads/core";

export const dynamic = "force-dynamic";

export async function GET(req:NextRequest){
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller){
      function send(obj:any){
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      }
      send({ ok:true, kind:"hello", ts: Date.now() });
      const iv = setInterval(()=>{
        try{
          const s = loadStore();
          send({ ok:true, kind:"totals", totals: s.totals, ts: Date.now() });
        }catch{
          send({ ok:false, error:"read_failed", ts: Date.now() });
        }
      }, 2000);
      (req as any).signal?.addEventListener?.("abort", ()=> clearInterval(iv));
    }
  });
  return new Response(stream, {
    headers:{
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
