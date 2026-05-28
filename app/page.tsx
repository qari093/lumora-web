import Link from "next/link";

const portals = [
  { name: "FYP", href: "/fyp", desc: "Adaptive discovery engine" },
  { name: "GMAR", href: "/gmar", desc: "Gaming civilization" },
  { name: "Live", href: "/live", desc: "Realtime emotional presence" },
  { name: "NEXA", href: "/nexa", desc: "Human optimization sanctuary" },
  { name: "CineVerse", href: "/cineverse", desc: "Movie civilization" },
  { name: "Echo", href: "/echo", desc: "Music and resonance" },
  { name: "Zendoro", href: "/zendoro", desc: "Commerce ecosystem" },
  { name: "Zenwallet", href: "/zencoin", desc: "Zen economy layer" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_30%)]" />

      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-400/20 bg-white/5 backdrop-blur-xl mb-6">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-200 text-sm tracking-[0.2em] uppercase">
              Lumora Civilization Runtime
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            LUMORA
          </h1>

          <p className="mt-6 text-lg text-white/70 max-w-3xl leading-relaxed">
            Unified civilization platform connecting realtime presence,
            emotional intelligence, gaming, discovery, music, commerce,
            creator ecosystems, and adaptive digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {portals.map((portal) => (
            <Link
              key={portal.name}
              href={portal.href}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold tracking-wide">
                  {portal.name}
                </div>

                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
              </div>

              <p className="text-white/65 leading-relaxed">
                {portal.desc}
              </p>

              <div className="mt-8 text-cyan-300 text-sm font-medium">
                Enter Portal →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
