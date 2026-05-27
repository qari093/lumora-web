import { resolveNativeFypPublicUrl } from "./config";

export function buildNativeFypPosterKey(input: {
  userId: string;
  videoId: string;
}): string {
  const safeUser = input.userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeVideo = input.videoId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `posters/${safeUser}/${safeVideo}.jpg`;
}

export function buildNativeFypPosterUrl(input: {
  userId: string;
  videoId: string;
  publicBaseUrl?: string;
}): string {
  const key = buildNativeFypPosterKey(input);
  return resolveNativeFypPublicUrl(
    key,
    input.publicBaseUrl ? { publicBaseUrl: input.publicBaseUrl } : undefined,
  );
}
