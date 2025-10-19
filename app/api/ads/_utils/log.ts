export function logErr(scope: string, e: any) {
  const msg = (e && (e.message || e.toString())) || String(e);
  // eslint-disable-next-line no-console
  console.error("[ADS:"+scope+"]", msg);
}
