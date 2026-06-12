import FypAutoplayFeed from "./FypAutoplayFeed";

async function getRuntimeFypItems() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/fyp/feed`, {
    cache: "no-store"
  });

  if (!response.ok) return [];

  const json = await response.json();

  return Array.isArray(json.items)
    ? json.items.map((item: any) => ({
        id: String(item.id),
        sourceName: String(item.sourceId || item.creator || "Lumora"),
        handle: `@${String(item.creator || "lumora").toLowerCase().replace(/[^a-z0-9]+/g, "")}`,
        policy: "owned or licensed",
        title: String(item.title || "Lumora Signal"),
        lane: String(item.lane || item.category || "space"),
        videoUrl: String(item.videoUrl || item.playbackUrl || ""),
        posterUrl: "",
        likes: "LIVE",
        comments: "Trace",
        saves: "Save",
        shares: "Share"
      }))
    : [];
}

export default async function FypPage() {
  const items = await getRuntimeFypItems();

  return <FypAutoplayFeed items={items} />;
}
