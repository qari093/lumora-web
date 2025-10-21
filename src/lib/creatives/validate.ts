const MAX_URL = 2048;
function looksHttp(u:string){ return /^https?:\/\//i.test(u); }
function looksHttps(u:string){ return /^https:\/\//i.test(u); }
function isStatic(u:string){ return typeof u==="string" && u.startsWith("/static/"); }

export function isSafeImageUrl(u:string){
  if (typeof u!=="string" || !u || u.length>MAX_URL) return { ok:false, reason:"BAD_URL" as const };
  if (isStatic(u)) return { ok:true, local:true };
  if (looksHttp(u)) return { ok:true, local:false };
  return { ok:false, reason:"UNSUPPORTED_SCHEME" as const };
}

export function isSafeActionUrl(u:string){
  if (typeof u!=="string" || !u || u.length>MAX_URL) return { ok:false, reason:"BAD_URL" as const };
  if (!looksHttps(u)) return { ok:false, reason:"HTTPS_REQUIRED" as const };
  return { ok:true };
}
