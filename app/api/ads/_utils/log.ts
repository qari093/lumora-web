export function logErr(scope: string, e: any) {
  const msg = (e && (e.message || e.toString())) || String(e);
  console.error("[ADS:"+scope+"]", msg);
}
