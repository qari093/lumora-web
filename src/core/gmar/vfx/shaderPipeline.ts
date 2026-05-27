export function shaderQuality(tier: number) {
  return {
    bloom: tier >= 2,
    particles: tier >= 1,
    reflections: tier >= 3
  };
}
