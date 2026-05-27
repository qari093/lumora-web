export function bodyWeather(stress: number) {
  return {
    mode: stress > 0.7 ? "recovery" : "balanced",
    safe: true
  };
}
