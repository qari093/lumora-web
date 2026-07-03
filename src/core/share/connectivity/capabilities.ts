import type { ConnectivityCapability, ConnectivityChannel } from "./types";

export const connectivityCapabilities: ConnectivityCapability[] = [
  { channel: "whatsapp", external: true, supportsText: true, supportsUrl: true, supportsFiles: false, supportsSilentDelivery: false, requiresUserGesture: true },
  { channel: "telegram", external: true, supportsText: true, supportsUrl: true, supportsFiles: false, supportsSilentDelivery: false, requiresUserGesture: true },
  { channel: "signal", external: true, supportsText: true, supportsUrl: true, supportsFiles: false, supportsSilentDelivery: false, requiresUserGesture: true },
  { channel: "sms", external: true, supportsText: true, supportsUrl: true, supportsFiles: false, supportsSilentDelivery: false, requiresUserGesture: true },
  { channel: "email", external: true, supportsText: true, supportsUrl: true, supportsFiles: true, supportsSilentDelivery: false, requiresUserGesture: true },
  { channel: "qr", external: true, supportsText: false, supportsUrl: true, supportsFiles: false, supportsSilentDelivery: true, requiresUserGesture: false },
  { channel: "nfc", external: true, supportsText: false, supportsUrl: true, supportsFiles: false, supportsSilentDelivery: true, requiresUserGesture: true },
  { channel: "airdrop", external: true, supportsText: true, supportsUrl: true, supportsFiles: true, supportsSilentDelivery: false, requiresUserGesture: true },
  { channel: "nearby_share", external: true, supportsText: true, supportsUrl: true, supportsFiles: true, supportsSilentDelivery: false, requiresUserGesture: true },
  { channel: "web_embed", external: true, supportsText: true, supportsUrl: true, supportsFiles: false, supportsSilentDelivery: true, requiresUserGesture: false },
  { channel: "api", external: true, supportsText: true, supportsUrl: true, supportsFiles: true, supportsSilentDelivery: true, requiresUserGesture: false },
  { channel: "import_export", external: true, supportsText: true, supportsUrl: true, supportsFiles: true, supportsSilentDelivery: true, requiresUserGesture: false },
  { channel: "federation", external: true, supportsText: true, supportsUrl: true, supportsFiles: true, supportsSilentDelivery: true, requiresUserGesture: false },
];

export function getConnectivityCapability(channel: ConnectivityChannel): ConnectivityCapability {
  const capability = connectivityCapabilities.find((item) => item.channel === channel);
  if (!capability) throw new Error(`connectivity_channel_missing:${channel}`);
  return capability;
}

export function listConnectivityChannels(): ConnectivityChannel[] {
  return connectivityCapabilities.map((item) => item.channel);
}
