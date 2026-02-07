export default function SharePage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Share</h1>

      <p className="opacity-70 text-sm">
        Share your Lumora experience. Seed mode UI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5 space-y-2">
          <div className="font-medium">Invite Friends</div>
          <div className="text-sm opacity-70">
            Generate private invite links (coming next).
          </div>
        </div>

        <div className="rounded-xl border p-5 space-y-2">
          <div className="font-medium">Share a Portal</div>
          <div className="text-sm opacity-70">
            Share FYP, GMAR, NEXA, Movies, Music, Live.
          </div>
        </div>

        <div className="rounded-xl border p-5 space-y-2">
          <div className="font-medium">Creator Links</div>
          <div className="text-sm opacity-70">
            Public profile & highlights (future).
          </div>
        </div>

        <div className="rounded-xl border p-5 space-y-2">
          <div className="font-medium">Export Moments</div>
          <div className="text-sm opacity-70">
            Clips, screenshots, reactions (future).
          </div>
        </div>
      </div>
    </main>
  );
}
