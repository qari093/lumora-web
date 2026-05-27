export function createNativeVideoId(seed: string): string {
  const clean = seed.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `nfyp_${clean}_${Date.now()}`;
}
