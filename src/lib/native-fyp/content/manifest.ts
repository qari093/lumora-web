export type NativeFypContentManifest = {
  videoId: string;
  title: string;
  playbackUrl: string;
  posterUrl: string;
  durationSeconds: number;
  rightsStatus: "verified";
  licenseType: "owned" | "creator_grant" | "royalty_free" | "direct_license" | "lumora_generated";
  createdAt: string;
};

export function createContentManifest(input: Omit<NativeFypContentManifest, "createdAt">): NativeFypContentManifest {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}
