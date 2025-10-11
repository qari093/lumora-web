import { NextResponse } from "next/server";
import { snapshotPool } from "@/lib/energyStore";

export const dynamic = "force-dynamic";

export async function GET(){
  const stream = new ReadableStream({
    async start(controller){
      const enc = new TextEncoder();
      const write = (obj:any)=>controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      const send = async ()=>{ const p = await snapshotPool(); write({ t: Date.now(), pool: p }); };
      const iv = setInterval(send, 2000);
      await send();
      // @ts-ignore
      controller._iv = iv;
    },
    cancel(){
      // @ts-ignore
      const iv = (this as any)?._iv; if(iv) clearInterval(iv);
    }
  });
  return new NextResponse(stream as any, {
    headers:{
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache, no-transform",
      "Connection":"keep-alive",
      "X-Accel-Buffering":"no",
    }
  });
}
