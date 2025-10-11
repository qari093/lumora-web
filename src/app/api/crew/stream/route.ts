import { NextResponse } from "next/server";
import { getOrSetUid } from "@/lib/uid";
import { crewOf } from "@/lib/crewStore";

export const dynamic = "force-dynamic";

export async function GET(){
  const uid = getOrSetUid();

  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      const write = (obj:any) => controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      const send = () => {
        const c = crewOf(uid);
        write({ t: Date.now(), crew: c });
      };
      const iv = setInterval(send, 2000);
      send(); // bootstrap
      // @ts-ignore
      controller._iv = iv;
    },
    cancel(reason){
      // @ts-ignore
      const iv = (this as any)?._iv; if(iv) clearInterval(iv);
    }
  });

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
