import type { SharePortal } from "../foundation/types";

export type ShareDestinationKind = "portal" | "person" | "group" | "community" | "external" | "system";

export type UniversalShareDestination = {
  id: string;
  kind: ShareDestinationKind;
  portal: SharePortal;
  label: string;
  description: string;
  icon: string;
  priority: number;
  supportsSilent: boolean;
  supportsEcho: boolean;
  supportsQr: boolean;
  supportsExternal: boolean;
};

export const universalShareDestinations: UniversalShareDestination[] = [
  { id: "lumaspace", kind: "portal", portal: "lumaspace", label: "LumaSpace", description: "Save as memory, star, garden, constellation, or capsule.", icon: "✦", priority: 100, supportsSilent: true, supportsEcho: true, supportsQr: false, supportsExternal: false },
  { id: "lumalink", kind: "portal", portal: "lumalink", label: "LumaLink", description: "Continue as a rich conversation card.", icon: "◌", priority: 92, supportsSilent: false, supportsEcho: true, supportsQr: false, supportsExternal: false },
  { id: "live", kind: "portal", portal: "live", label: "Live", description: "Share into a room, replay, or watch-together moment.", icon: "◉", priority: 84, supportsSilent: false, supportsEcho: false, supportsQr: true, supportsExternal: false },
  { id: "zendoro", kind: "portal", portal: "zendoro", label: "Zendoro", description: "Share as wishlist, product, gift, or recommendation.", icon: "◇", priority: 70, supportsSilent: true, supportsEcho: false, supportsQr: true, supportsExternal: false },
  { id: "memory_vault", kind: "portal", portal: "memory_vault", label: "Memory Vault", description: "Archive permanently with provenance and permissions.", icon: "◈", priority: 68, supportsSilent: true, supportsEcho: true, supportsQr: false, supportsExternal: false },
  { id: "external_copy", kind: "external", portal: "external", label: "Copy Link", description: "Create a universal Lumora deep link.", icon: "↗️", priority: 42, supportsSilent: false, supportsEcho: false, supportsQr: false, supportsExternal: true },
  { id: "external_qr", kind: "external", portal: "external", label: "QR", description: "Generate a scannable share code.", icon: "▦", priority: 38, supportsSilent: false, supportsEcho: false, supportsQr: true, supportsExternal: true },
  { id: "system_share", kind: "system", portal: "external", label: "System Share", description: "Use the device share sheet.", icon: "⇪", priority: 30, supportsSilent: false, supportsEcho: false, supportsQr: false, supportsExternal: true }
];

export function getShareDestination(id: string): UniversalShareDestination | undefined {
  return universalShareDestinations.find((destination) => destination.id === id);
}
