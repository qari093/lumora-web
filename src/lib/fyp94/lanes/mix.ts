import { getFyp94Lane } from "./map";

export function mixFyp94Lanes(items: any[]) {
  const buckets: Record<string, any[]> = {};

  for (const item of items) {
    const lane = getFyp94Lane(item);
    if (!buckets[lane]) buckets[lane] = [];
    buckets[lane].push(item);
  }

  const lanes = Object.keys(buckets);
  const result: any[] = [];

  let added = true;

  while (added) {
    added = false;

    for (const lane of lanes) {
      if (buckets[lane].length > 0) {
        result.push(buckets[lane].shift());
        added = true;
      }
    }
  }

  return result;
}
