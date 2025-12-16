import { persistEmmlSnapshot } from "../app/_server/emml-snapshot";

export async function runOnce() {
  await persistEmmlSnapshot({
    marketsOnline: 1,
    indicesTracked: 1,
    heatSampleSize: 10,
    health: "ok",
  });
}
