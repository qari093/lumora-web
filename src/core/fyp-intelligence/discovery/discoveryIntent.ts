export function discoveryIntent(mode: "calm" | "curious" | "active" = "curious") {
  return { mode, discoverable: true };
}
