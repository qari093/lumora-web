export function clickAd(params: { type: "portal" | "external"; value: string }) {
  const query = new URLSearchParams({
    type: params.type,
    value: params.value,
  }).toString();

  window.location.href = `/api/ads/click?${query}`;
}
