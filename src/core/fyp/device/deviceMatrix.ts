export const FYP_DEVICE_MATRIX = [
  { name: "iPhone 8", os: "iOS 15", tier: "low" },
  { name: "iPhone 12", os: "iOS 16", tier: "mid" },
  { name: "iPhone 14", os: "iOS 17", tier: "high" },
  { name: "Samsung Galaxy A12", os: "Android 11", tier: "low" },
  { name: "Google Pixel 6", os: "Android 13", tier: "mid" },
  { name: "Samsung Galaxy S23", os: "Android 14", tier: "high" },
  { name: "Lenovo Tab M8", os: "Android Tablet", tier: "tablet" }
] as const;

export const FYP_NETWORK_MATRIX = [
  { name: "wifi", kbps: 10000, latencyMs: 30 },
  { name: "4g", kbps: 4000, latencyMs: 80 },
  { name: "3g", kbps: 500, latencyMs: 100 },
  { name: "offline", kbps: 0, latencyMs: 0 }
] as const;

export function validateDeviceMatrix(): boolean {
  return (
    FYP_DEVICE_MATRIX.length >= 7 &&
    FYP_DEVICE_MATRIX.some(device => device.tier === "low") &&
    FYP_DEVICE_MATRIX.some(device => device.tier === "tablet") &&
    FYP_NETWORK_MATRIX.some(network => network.name === "3g") &&
    FYP_NETWORK_MATRIX.some(network => network.name === "offline")
  );
}
