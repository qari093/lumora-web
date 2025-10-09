type Level = "debug"|"info"|"warn"|"error";
export function log(level:Level, msg:string, data:Record<string,unknown> = {}){
  const line = { ts: new Date().toISOString(), level, msg, ...data };
  try { console[level === "debug" ? "log" : level](JSON.stringify(line)); } catch { console.log(line); }
}
export const info = (m:string,d?:any)=>log("info",m,d);
export const warn = (m:string,d?:any)=>log("warn",m,d);
export const error = (m:string,d?:any)=>log("error",m,d);
