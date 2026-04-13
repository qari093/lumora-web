export type VisualSkin = {
  blurRadius: number;
  overlayOpacity: number;
  edgeSoftness: number;
  preserveFaces: boolean;
};

export function buildVisualSkin(): VisualSkin {
  return {
    blurRadius: 16,
    overlayOpacity: 0.28,
    edgeSoftness: 0.6,
    preserveFaces: true
  };
}
