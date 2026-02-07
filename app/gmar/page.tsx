import { loadGmarGames } from "@/lib/gmar/loadGames";

export default function GmarPage() {
  const games = loadGmarGames();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">GMAR</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map(g => (
          <a
            key={g.id}
            href={g.cta}
            className="rounded-xl border p-5 hover:bg-white/5 transition"
          >
            <div className="text-lg font-medium">{g.title}</div>
            <div className="text-sm opacity-70">{g.tagline}</div>
            <div className="mt-2 text-xs uppercase opacity-50">
              Status: {g.status}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
