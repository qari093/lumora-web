export function guardedJson(
  _tag: string,
  data: unknown,
  init?: ResponseInit
): Response {
  const headers = new Headers(init?.headers);

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json; charset=utf-8");
  }

  if (!headers.has("cache-control")) {
    headers.set("cache-control", "no-store, must-revalidate");
  }

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}
