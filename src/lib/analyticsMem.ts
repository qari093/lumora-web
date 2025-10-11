type Ev = { t:number; type:string; props?:Record<string,any> };
const buf: Ev[] = [];
export function track(type:string, props?:Record<string,any>){ buf.push({t:Date.now(),type,props}); if(buf.length>5000) buf.shift(); }
export function stats(){
  const now=Date.now(); const inWin=(t:number,w:number)=>t>=now-w;
  const last = buf.slice(-2000);
  const per:Record<string,number> = {};
  last.forEach(e=>{ per[e.type]=(per[e.type]||0)+1; });
  return { last: last.length, lastMin: last.filter(e=>inWin(e.t,60_000)).length,
    lastHour:last.filter(e=>inWin(e.t,3_600_000)).length, perType: Object.entries(per) };
}
