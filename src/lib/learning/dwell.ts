export function calcDwell(start:number, end:number){
  return Math.max(0, end - start);
}
