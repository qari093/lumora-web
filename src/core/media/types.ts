export type MediaType = "image" | "video" | "audio" | "file";

export interface MediaAssetRuntime {
  id: string;
  type: MediaType;
  url: string;
  creatorId?: string;
}
