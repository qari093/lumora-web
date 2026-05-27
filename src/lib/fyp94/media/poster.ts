export function buildFyp94PosterUrl(assetId: string, baseUrl = "/native-fyp/posters"): string {
  const safeId = assetId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${baseUrl.replace(/\/$/, "")}/${safeId}.jpg`;
}

export function createFyp94PosterJob(input: {
  assetId: string;
  mp4Url: string;
}): {
  assetId: string;
  inputUrl: string;
  outputUrl: string;
  strategy: "first_frame";
} {
  return {
    assetId: input.assetId,
    inputUrl: input.mp4Url,
    outputUrl: buildFyp94PosterUrl(input.assetId),
    strategy: "first_frame",
  };
}
