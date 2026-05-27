export type DimmedSilhouette = {
  id: string;
  opacity: number; // 0..1
  dimmed: true;
};

export function buildDimmedSilhouette(id: string): DimmedSilhouette {
  return {
    id,
    opacity: 0.35,
    dimmed: true,
  };
}
