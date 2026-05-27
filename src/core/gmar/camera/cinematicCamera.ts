export type CameraPosition = {
  x: number;
  y: number;
  zoom: number;
};

export function createCamera(): CameraPosition {
  return {
    x: 0,
    y: 0,
    zoom: 1
  };
}
