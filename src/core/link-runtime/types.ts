export type LinkTargetKind = "creator" | "post" | "product" | "moment";

export interface LumoraLink {
  id: string;
  kind: LinkTargetKind;
  targetId: string;
  createdAt: string;
}
