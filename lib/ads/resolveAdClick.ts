type AdTarget =
  | { type: "portal"; value: string }
  | { type: "external"; value: string };

export function resolveAdClick(target?: AdTarget): string {
  if (!target) return "/";

  if (target.type === "portal") {
    return `/portal/${target.value}`;
  }

  if (target.type === "external") {
    return target.value;
  }

  return "/";
}
