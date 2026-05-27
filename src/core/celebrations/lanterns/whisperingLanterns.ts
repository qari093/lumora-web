export function createLantern() {
  return {
    symbolic: true,
    ephemeral: true,
    storage: "none",
    fallback: "glow-only"
  } as const;
}

export function createWhisperingLanternRelay() {
  return {
    active: true,
    delivery: "edge-ephemeral",
    maxBlobKb: 50,
    persistentStorage: false
  } as const;
}
