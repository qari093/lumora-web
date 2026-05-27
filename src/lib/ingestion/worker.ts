import { popJob } from "./queue";

export function runWorker(){
  const job = popJob();
  if(!job) return null;
  return { processed: true, job };
}
