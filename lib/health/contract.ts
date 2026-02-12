export function isoNow(): string {
  return new Date().toISOString();
}

export function getServiceName(): string {
  return process.env.LUMORA_SERVICE_NAME || "lumora-web";
}

export function getAppVersion(): string {
  return (
    process.env.NEXT_PUBLIC_APP_VERSION ||
    process.env.APP_VERSION ||
    "0.0.0-dev"
  );
}

export function getBaseUrlFromRequest(req: Request): string {
  try {
    const url = new URL(req.url);

    // Respect forwarded headers if present (proxy / test harness)
    const proto =
      req.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");

    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      url.host;

    return `${proto}://${host}`;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

export function jsonResponse(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}
