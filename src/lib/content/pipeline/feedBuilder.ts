import { fetchProcessPipeline } from "./fetchAndProcess";

export async function buildFypFeed() {
  const { accepted } = await fetchProcessPipeline();

  return accepted.map((item) => ({
    id: item.id,
    title: item.title || "Lumora Clip",
    videoUrl: item.playableUrl,
    source: item.source,
    hasAudio: true,
    category: "Mixed",
  }));
}
