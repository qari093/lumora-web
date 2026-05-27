export function buildFyp94AssetStorageKey(input: {
  source: string;
  assetId: string;
  filename: string;
}): string {
  const safeSource = input.source.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeAsset = input.assetId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeFile = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `fyp94/${safeSource}/${safeAsset}/${safeFile}`;
}

export function buildFyp94StoredAssetUrl(key: string, baseUrl = "/native-fyp/assets"): string {
  return `${baseUrl.replace(/\/$/, "")}/${key.replace(/^\/+/, "")}`;
}
