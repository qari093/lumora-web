export function getFyp94Decade(item: any): string {
  const text = `${item.title || ""} ${item.query || ""} ${item.sourceUrl || ""}`.toLowerCase();

  const match = text.match(/\b(19[0-9]0|20[0-2]0)s?\b/);
  if (match) return match[1] + "s";

  if (text.includes("vintage") || text.includes("retro") || text.includes("archive") || item.source === "archive")
    return "retro";

  if (item.source === "nasa") return "space-era";

  return "modern";
}
