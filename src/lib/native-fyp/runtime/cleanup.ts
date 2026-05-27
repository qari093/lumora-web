export function cleanupVideoElement(video?: HTMLVideoElement | null) {
  if (!video) return;
  try {
    video.pause();
    video.removeAttribute("src");
    video.load();
  } catch {}
}
