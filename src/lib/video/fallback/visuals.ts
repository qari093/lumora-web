export type FallbackVisual = {
  id: string;
  kind: "poster" | "gradient" | "text-card";
  label: string;
  safe: true;
};

export function getFallbackVisuals(): FallbackVisual[] {
  return [
    { id: "poster_safe", kind: "poster", label: "Safe poster fallback", safe: true },
    { id: "gradient_safe", kind: "gradient", label: "Prism gradient fallback", safe: true },
    { id: "text_safe", kind: "text-card", label: "Protected content placeholder", safe: true },
  ];
}
