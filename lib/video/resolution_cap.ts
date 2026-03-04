export type FreeTierCapResult =
  | { ok: true; capped: false; requested: number }
  | { ok: true; capped: true; requested: number; enforced: number }
  | { ok: false; error: "bad_resolution"; requestedRaw: string }

function parseResolutionToHeight(res: string): number | null {
  const s = (res || "").toString().trim().toLowerCase()
  if (!s) return null

  // formats: "720p", "1080", "1080p"
  const m1 = s.match(/^(\d{3,4})p?$/)
  if (m1) {
    const h = Number(m1[1])
    if (Number.isFinite(h) && h > 0) return h
    return null
  }

  // formats: "1920x1080"
  const m2 = s.match(/^(\d{3,4})\s*x\s*(\d{3,4})$/)
  if (m2) {
    const h = Number(m2[2])
    if (Number.isFinite(h) && h > 0) return h
    return null
  }

  return null
}

export function enforce720pFreeTierCap(
  requestedResolution: string,
  opts?: { isFreeTier: boolean; capHeight?: number }
): FreeTierCapResult {
  const cap = Math.max(1, opts?.capHeight ?? 720)
  const requested = parseResolutionToHeight(requestedResolution)

  if (requested == null) {
    return { ok: false, error: "bad_resolution", requestedRaw: requestedResolution }
  }

  if (!opts?.isFreeTier) {
    return { ok: true, capped: false, requested }
  }

  if (requested > cap) {
    return { ok: true, capped: true, requested, enforced: cap }
  }

  return { ok: true, capped: false, requested }
}
