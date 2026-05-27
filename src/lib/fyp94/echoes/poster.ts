export function buildFyp94EchoPosterComposite(input: {
  posterIds: string[];
}): string {
  return `echo_composite_${input.posterIds.join("_")}`.replace(/[^a-zA-Z0-9_-]/g, "_");
}
