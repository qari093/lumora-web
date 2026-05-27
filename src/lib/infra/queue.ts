const q:any[] = [];

export function pushTask(t:any){
  q.push(t);
}

export function popTask(){
  return q.shift() || null;
}

export function size(){
  return q.length;
}
