export type GeoCell = { id: string; center: { lat: number; lng: number }; precision: number };

export function toCell(lat: number, lng: number, precision = 0.5): GeoCell {
  const clat = Math.round(lat / precision) * precision;
  const clng = Math.round(lng / precision) * precision;
  const id = `${clat.toFixed(3)},${clng.toFixed(3)}:${precision}`;
  return { id, center: { lat: clat, lng: clng }, precision };
}
