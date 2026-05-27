import type { MemorialGardenState, MemorialRequest } from "./types";

export function buildMemorialGardenState(request: MemorialRequest): MemorialGardenState {
  const active = request.creatorApproved || request.verifiedFamilyApproval;

  return {
    active,
    status: active ? "memorial_verified" : "none",
    monetized: false,
    allowedGestures: active ? ["remembrance_flower", "quiet_honor", "soft_echo"] : []
  };
}

export function validateMemorialRequest(request: MemorialRequest): boolean {
  return request.creatorApproved === true || request.verifiedFamilyApproval === true;
}
