import { loadVideoFeed } from "@/lib/videos/loadVideos";

export default function VideosPage() {
  const videos = loadVideoFeed();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Videos</h1>
      {videos.map(v => (
        <div key={v.id} className="rounded-xl border p-4 flex justify-between">
          <div>{v.title}</div>
          <div className="text-sm opacity-60">{v.duration}</div>
        </div>
      ))}
    </main>
  );
}
