export type ShareEventName = "link_created" | "link_opened" | "save_from_link" | "subscribe_from_link";

export function createShareEvent(name: ShareEventName, slug: string) {
  return {
    name,
    slug,
    ts: new Date().toISOString(),
  };
}
