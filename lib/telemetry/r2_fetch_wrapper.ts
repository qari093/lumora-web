import { recordR2Egress } from "@/lib/telemetry/r2_egress"

/**
 * Wraps a Response to record approximate egress bytes.
 * Safe for Node & Edge. Uses content-length header if available.
 */
export async function recordR2Response(
  assetKey: string,
  response: Response
): Promise<Response> {
  try {
    const lenHeader = response.headers.get("content-length")
    if (lenHeader) {
      const bytes = Number(lenHeader)
      if (Number.isFinite(bytes)) {
        recordR2Egress(assetKey, bytes)
      }
      return response
    }

    // Fallback: clone + measure (only if body small / readable)
    const clone = response.clone()
    const buf = await clone.arrayBuffer().catch(() => null)
    if (buf) {
      recordR2Egress(assetKey, buf.byteLength)
    }
  } catch {
    // swallow — telemetry must never break delivery
  }
  return response
}
