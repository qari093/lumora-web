export const EnvironmentalWorlds = Object.freeze([
  {
    id: "dream",
    atmosphere: "golden-fireflies",
    reveal: "focus",
    textVisible: false
  },
  {
    id: "wonder",
    atmosphere: "cyan-stardust",
    reveal: "focus",
    textVisible: false
  },
  {
    id: "creator",
    atmosphere: "blue-forge",
    reveal: "focus",
    textVisible: false
  },
  {
    id: "shadow",
    atmosphere: "violet-nebula",
    reveal: "focus",
    textVisible: false
  },
  {
    id: "gaming",
    atmosphere: "neon-grid",
    reveal: "focus",
    textVisible: false
  },
  {
    id: "calm",
    atmosphere: "lotus-water",
    reveal: "focus",
    textVisible: false
  }
]);

export function validateEnvironmentalWorlds() {
  return (
    EnvironmentalWorlds.length === 6 &&
    EnvironmentalWorlds.every(w => w.reveal === "focus") &&
    EnvironmentalWorlds.every(w => w.textVisible === false)
  );
}
