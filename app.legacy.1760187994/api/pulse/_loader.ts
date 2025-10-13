export async function loadHarmony(){
  try { return await import("../../../src/lib/econ/harmony"); }
  catch { /* fall through */ }
  return await import("../../../lib/econ/harmony");
}
