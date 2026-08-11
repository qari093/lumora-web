import { cookies, headers } from 'next/headers';

export type VendorOwner = { ownerId: string; source: 'cookie' | 'header' | 'demo' };

async function readCookie(): Promise<string | null> {
  try {
    const c = await cookies();
    const v =
      c.get('vendor_owner')?.value ||
      c.get('vendor_owner_id')?.value ||
      c.get('ownerId')?.value ||
      c.get('owner_id')?.value ||
      null;
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

async function readHeader(): Promise<string | null> {
  try {
    const h = await headers();
    const v = h.get('x-vendor-owner') || h.get('x-vendor-owner-id') || h.get('x-owner-id') || null;
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

export async function resolveVendorOwnerId(): Promise<VendorOwner> {
  const cookieId = await readCookie();
  if (cookieId) return { ownerId: cookieId, source: 'cookie' };
  const headerId = await readHeader();
  if (headerId) return { ownerId: headerId, source: 'header' };
  return { ownerId: 'demo_vendor_owner', source: 'demo' };
}

export async function getVendorOwnerId(): Promise<string> {
  return (await resolveVendorOwnerId()).ownerId;
}

export async function requireVendorOwnerId(opts?: { allowDemo?: boolean }): Promise<string> {
  const allowDemo = opts?.allowDemo ?? true;
  const o = await resolveVendorOwnerId();
  if (!allowDemo && o.source === 'demo') throw new Error('Vendor owner missing');
  return o.ownerId;
}

export const requireVendorOwner = requireVendorOwnerId;
export const resolveOwnerId = resolveVendorOwnerId;

export default { resolveVendorOwnerId, getVendorOwnerId, requireVendorOwnerId };

// Added by launch(step11): stabilize build by exporting OWNER_ID used by vendor pages.
// NOTE: Keep stable for dev/demo; replace with authenticated owner binding in later steps.
export const OWNER_ID = process.env.NEXT_PUBLIC_VENDOR_OWNER_ID || 'owner_dev_1769094299039';
