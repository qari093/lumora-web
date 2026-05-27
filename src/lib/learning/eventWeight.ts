export function eventWeight(type:string){
  const map:any = {
    watch: 1,
    complete: 2,
    like: 2,
    share: 3,
    save: 3,
    skip: -1,
    pause: 0.2,
    scroll: 0.1,
    open: 0.5
  };
  return map[type] ?? 0;
}
