export function atmospherePreset(time: "day" | "night") {
  return {
    fog: time === "night",
    brightness: time === "day" ? 1 : 0.35
  };
}
