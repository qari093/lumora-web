export function buildNativeFypObjectKey(input: {
  userId: string;
  videoId: string;
  filename: string;
}): string {
  const safeUser = input.userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeVideo = input.videoId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeFile = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  return `uploads/${safeUser}/${safeVideo}/${safeFile}`;
}
