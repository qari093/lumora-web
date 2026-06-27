import type {
  FypToLumaSpaceInput,
  FypToLumaSpacePost
} from "./lumaspaceBridgeTypes";

export function createFypLumaSpacePost(
  input: FypToLumaSpaceInput
): FypToLumaSpacePost {
  if (!input.assetId.trim()) {
    throw new Error("assetId_required");
  }

  if (!input.spaceId.trim()) {
    throw new Error("spaceId_required");
  }

  if (!input.userId.trim()) {
    throw new Error("userId_required");
  }

  return {
    id: `fyp_space_${input.spaceId}_${input.assetId}`,
    assetId: input.assetId,
    spaceId: input.spaceId,
    userId: input.userId,
    note: input.note?.trim() || "",
    traceBackUrl: `/fyp?trace=${encodeURIComponent(input.assetId)}`,
    createdAt: Date.now()
  };
}
