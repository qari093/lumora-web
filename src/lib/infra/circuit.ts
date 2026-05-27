const s:any = {};

export function fail(n:string){ s[n]=(s[n]||0)+1; }
export function reset(n:string){ s[n]=0; }
export function open(n:string,t:number=5){ return (s[n]||0)>=t; }
