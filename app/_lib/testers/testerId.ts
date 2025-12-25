export function getOrCreateTesterId(): string {
  if (typeof window === "undefined") return "server";
  const key = "lumora_tester_id";
  let v = "";
  try {
    v = window.localStorage.getItem(key) || "";
  } catch {}
  if (!v) {
    const rnd = Math.random().toString(36).slice(2);
    v = `t_${Date.now().toString(36)}_${rnd}`;
    try {
      window.localStorage.setItem(key, v);
    } catch {}
  }
  return v;
}
