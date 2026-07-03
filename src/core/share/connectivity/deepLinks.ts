export function createDeferredDeepLink(params: {
  origin: string;
  shareId: string;
  destination?: string;
  returnTo?: string;
}): string {
  const url = new URL(`${params.origin.replace(/\/+$/, "")}/share/${encodeURIComponent(params.shareId)}`);
  if (params.destination) url.searchParams.set("to", params.destination);
  if (params.returnTo) url.searchParams.set("returnTo", params.returnTo);
  url.searchParams.set("deferred", "1");
  return url.toString();
}

export function createAndroidIntentLink(params: {
  packageName: string;
  fallbackUrl: string;
  text: string;
}): string {
  return `intent://send?text=${encodeURIComponent(params.text)}#Intent;scheme=lumora;package=${params.packageName};S.browser_fallback_url=${encodeURIComponent(params.fallbackUrl)};end`;
}

export function createIOSUniversalLink(origin: string, shareId: string): string {
  return `${origin.replace(/\/+$/, "")}/ios/share/${encodeURIComponent(shareId)}`;
}
