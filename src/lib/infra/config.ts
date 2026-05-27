const cfg:any = { cacheTTL:30000, rate:10, retry:3 };

export function get(k:string){ return cfg[k]; }
export function set(k:string,v:any){ cfg[k]=v; }
