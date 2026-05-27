const queue:any[] = [];

export function pushJob(job:any){
  queue.push(job);
}

export function popJob(){
  return queue.shift();
}

export function getQueue(){
  return queue;
}
