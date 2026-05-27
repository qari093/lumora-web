export const nexaRegistry = {
  id: "nexa",
  name: "NEXA GX Ω∞",
  route: "/nexa",
  status: "runtime_visible",
  tagline: "Calm Performance. Fully Alive.",
  tabs: ["today", "move", "nourish", "recover", "you"]
} as const;

export function registryHealthy(): boolean {
  return (
    nexaRegistry.id === "nexa" &&
    nexaRegistry.route === "/nexa" &&
    nexaRegistry.status === "runtime_visible" &&
    nexaRegistry.tabs.length === 5 &&
    nexaRegistry.tabs.includes("recover")
  );
}
