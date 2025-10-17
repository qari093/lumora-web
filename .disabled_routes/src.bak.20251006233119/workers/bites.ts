import type { Server as IOServer } from "socket.io";
import prisma from "@/src/lib/db";

type State = { tick?: NodeJS.Timeout; running: boolean };
const globalAny = globalThis as unknown as { __bites?: State };
const TICK_MS = 1000;

export function initBitesWorker(io: IOServer){
  if (globalAny.__bites?.running) return globalAny.__bites!;
  const state: State = { running: true };
  async function loop(){
    try{
      // Pick one queued job
      const job = await prisma.renderJob.findFirst({ where:{ status:"QUEUED" }, orderBy:{ createdAt:"asc" }});
      if (job){
        await prisma.renderJob.update({ where:{ id: job.id }, data:{ status:"RUNNING", progress: 1 }});
        io.emit("bites:progress", { id: job.id, status:"RUNNING", progress:1 });

        // Simulate work 10 steps
        for (let p=10; p<=100; p+=10){
          await new Promise(r=>setTimeout(r, TICK_MS));
          await prisma.renderJob.update({ where:{ id: job.id }, data:{ progress: p }});
          io.emit("bites:progress", { id: job.id, status:"RUNNING", progress:p });
        }

        await prisma.renderJob.update({ where:{ id: job.id }, data:{ status:"DONE", outputUrl: `/cdn/renders/${job.id}.mp4` }});
        io.emit("bites:progress", { id: job.id, status:"DONE", progress:100, outputUrl:`/cdn/renders/${job.id}.mp4` });
      }
    }catch(e){
      console.error("bites loop:", (e as Error).message);
    }finally{
      state.tick = setTimeout(loop, 500); // poll fast
    }
  }
  state.tick = setTimeout(loop, 200);
  globalAny.__bites = state;
  return state;
}
