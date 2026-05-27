export type MirrorSkyPalette = {
  primary: string;
  secondary: string;
  particles: boolean;
};

export function mirrorHourSkyPalette(): MirrorSkyPalette {
  return {
    primary: "#D9B065",
    secondary: "#D99494",
    particles: true,
  };
}
