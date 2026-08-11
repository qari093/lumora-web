import { cookies, headers } from "next/headers";

export type VendorOwner = { ownerId: string; source: "cookie" | "header" | "demo" };

function readCookie(): string | null {
  try {
    const c = cookies();
    const v =
      c.get("vendor_owner")?.value ||
      c.get("vendor_owner_id")?.value ||
      c.get("ownerId")?.value ||
      c.get("owner_id")?.value ||
      null;
    return v && v.trim() ? v.trim() : null;
  } catch { return null; }
}

function readHeader(): string | null {
  try {
    const h = headers();
    const v =
      h.get("x-vendor-owner") ||
      h.get("x-vendor-owner-id") ||
      h.get("x-owner-id") ||
      null;
    return v && v.trim() ? v.trim() : null;
  } catch { return null; }
}

export function resolveVendorOwnerId(): VendorOwner {
  const cookieId = readCookie();
  if (cookieId) return { ownerId: cookieId, source: "cookie" };
  const headerId = readHeader();
  if (headerId) return { ownerId: headerId, source: "header" };
  return { ownerId: "demo_vendor_owner", source: "demo" };
}

export function getVendorOwnerId(): string {
  return resolveVendorOwnerId().ownerId;
}

export function requireVendorOwnerId(opts?: { allowDemo?: boolean }): string {
  const allowDemo = opts?.allowDemo ?? true;
  const o = resolveVendorOwnerId();
  if (!allowDemo && o.source === "demo") throw new Error("Vendor owner missing");
  return o.ownerId;
}

export const requireVendorOwner = requireVendorOwnerId;
export const resolveOwnerId = resolveVendorOwnerId;

export default { resolveVendorOwnerId, getVendorOwnerId, requireVendorOwnerId };

// Added by launch(step11): stabilize build by exporting OWNER_ID used by vendor pages.
// NOTE: Keep stable for dev/demo; replace with authenticated owner binding in later steps.
export const OWNER_ID = process.env.NEXT_PUBLIC_VENDOR_OWNER_ID || "owner_dev_1769094299039";
