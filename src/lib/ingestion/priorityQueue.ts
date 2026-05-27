type Job = { priority:number; payload:any };

const queue: Job[] = [];

export function pushPriorityJob(payload:any, priority:number=0){
  queue.push({ payload, priority });
  queue.sort((a,b) => b.priority - a.priority);
}

export function popPriorityJob(){
  const job = queue.shift();
  return job ? job.payload : null;
}

export function getPriorityQueue(){
  return [...queue];
}
