export type ShareLinkKind = "creator" | "post" | "product" | "saved_moment";

export interface ShareLinkRuntime {
  slug: string;
  kind: ShareLinkKind;
  targetId: string;
}
