export const FYP94_NO_CACHE_HEADERS = {
  "cache-control": "no-store, no-cache, must-revalidate",
  pragma: "no-cache",
  expires: "0",
};

export function buildFyp94NoCacheHeaders() {
  return FYP94_NO_CACHE_HEADERS;
}
