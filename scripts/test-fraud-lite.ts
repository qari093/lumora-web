/**
 * Disabled stub (kept for path stability).
 * Re-enable only when Fraud module is implemented.
 */
export async function main() {
  return { ok: true, disabled: true };
}

declare const require: any;
declare const module: any;
declare const process: any;

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  // eslint-disable-next-line no-console
  main().then((r) => console.log(r)).catch((e) => { console.error(e); process.exit(1); });
}
