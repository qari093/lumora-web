import { getLatestEmmlSnapshot } from "./emml-snapshot";
export { getLatestEmmlSnapshot };

export async function getEmmlHealth() {
  const snap = await getLatestEmmlSnapshot();
  if (!snap) return { ok: false };
  return { ok: true, snapshot: snap };
}
