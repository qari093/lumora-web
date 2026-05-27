export function getFyp94Lane(item: any): string {
  const q = (item.query || "").toLowerCase();
  const s = (item.source || "").toLowerCase();

  if (s === "nasa" || q.includes("space") || q.includes("earth") || q.includes("rocket"))
    return "cosmic";

  if (q.includes("city") || q.includes("car") || q.includes("street"))
    return "urban";

  if (q.includes("sport") || q.includes("football") || q.includes("basketball") || q.includes("parkour"))
    return "action";

  if (q.includes("nature") || q.includes("rain") || q.includes("slow") || q.includes("calm"))
    return "calm";

  if (s === "archive" || q.includes("retro") || q.includes("vintage"))
    return "retro";

  return "mixed";
}
