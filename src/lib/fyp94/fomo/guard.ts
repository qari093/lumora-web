import type { Fyp94FomoItem } from "./types";

export function preventFyp94FomoStacking<T>(items: Fyp94FomoItem<T>[]): Fyp94FomoItem<T>[] {
  let lastWasFomo = false;

  return items.map((item) => {
    const isFomo = item.fomoType !== "normal";

    if (isFomo && lastWasFomo) {
      lastWasFomo = false;
      return { ...item, fomoType: "normal" };
    }

    lastWasFomo = isFomo;
    return item;
  });
}

export function isFyp94FomoExpired(item: Pick<Fyp94FomoItem, "expiresAt">, now = new Date()): boolean {
  if (!item.expiresAt) return false;
  return new Date(item.expiresAt).getTime() <= now.getTime();
}

export function filterExpiredFyp94Fomo<T>(items: Fyp94FomoItem<T>[], now = new Date()): Fyp94FomoItem<T>[] {
  return items.filter((item) => !isFyp94FomoExpired(item, now));
}
