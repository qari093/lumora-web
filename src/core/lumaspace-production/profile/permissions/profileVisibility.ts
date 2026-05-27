import type { ProfileIdentity } from "../types";

export function canViewProfile(identity: ProfileIdentity, viewerRelation: "self" | "friend" | "public"): boolean {
  if (identity.visibility === "public") return true;
  if (identity.visibility === "friends") return viewerRelation === "self" || viewerRelation === "friend";
  return viewerRelation === "self";
}
