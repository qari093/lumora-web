export type ResolvedAdRoute = {
  type: "portal" | "external";
  value: string;
  destination: string;
  valid: boolean;
};

const PORTAL_ROUTE_MAP: Record<string, string> = {
  gmar: "/gmar",
  nexa: "/nexa",
  live: "/live",
  movies: "/movies",
  fyp: "/fyp",
  lumaspace: "/lumaspace",
  share: "/share",
};

export function resolveAdRoute(input: {
  type: string;
  value: string;
}): ResolvedAdRoute {
  const type = input.type === "external" ? "external" : "portal";
  const value = String(input.value || "").trim();

  if (type === "external") {
    const valid = /^https?:\/\//i.test(value);
    return {
      type,
      value,
      destination: valid ? value : "",
      valid,
    };
  }

  const key = value.toLowerCase();
  const destination = PORTAL_ROUTE_MAP[key] || "";

  return {
    type,
    value,
    destination,
    valid: destination.length > 0,
  };
}
