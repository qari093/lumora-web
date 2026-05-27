export function createClipboardPayload(input: { caption: string; hashtags: string[] }) {
  return {
    caption: `${input.caption}\n${input.hashtags.join(" ")}`.trim(),
    ready: true,
  };
}
