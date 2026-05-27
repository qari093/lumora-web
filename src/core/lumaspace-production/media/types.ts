export interface MediaAsset {
  id: string;
  type: "image" | "video" | "audio";
  quality: "sd" | "hd";
  optimized: boolean;
}

export interface StreamSession {
  id: string;
  bitrate: number;
  active: boolean;
}

export interface MediaRuntime {
  active: boolean;
  assets: MediaAsset[];
}
