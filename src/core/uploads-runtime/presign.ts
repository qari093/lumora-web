export function createUploadPresign(input: { filename: string }) {
  return {
    uploadUrl: `/mock-upload/${encodeURIComponent(input.filename)}`,
    method: "PUT",
  };
}
