import Link from "next/link";
import LumoraTopNav from "@/components/navigation/LumoraTopNav";

const portals = [
  { name: "FYP", href: "/fyp", desc: "Adaptive video discovery, emotional ranking, creator signals.", signal: "Discovery" },
  { name: "GMAR", href: "/gmar", desc: "Playable game civilization hub with economy and community.", signal: "Games" },
  { name: "Live", href: "/live", desc: "Realtime rooms, presence, sparks, safety, and creator rituals.", signal: "Realtime" },
  { name: "NEXA", href: "/nexa", desc: "Sanctuary for recovery, movement, calm, and human optimization.", signal: "Wellness" },
  { name: "CineVerse", href: "/cineverse", desc: "Movie portal, open canon, trailers, and cinematic FYP.", signal: "Cinema" },
  { name: "Echo", href: "/echo", desc: "Music identity, sonic rituals, tracks, and emotional resonance.", signal: "Audio" },
  { name: "Zendoro", href: "/zendoro", desc: "Commerce layer, storefront, seller tools, and trust systems.", signal: "Commerce" },
  { name: "Zenwallet", href: "/zenwallet", desc: "Wallet, Zencoin utility, ledger, rewards, and transparency.", signal: "Economy" },
  { name: "Creator Hub", href: "/creator-hub", desc: "Creator dashboard, rituals, publishing, live sync, and community growth.", signal: "Creator" }
];

export default function HomePage() {
  return (
    <main className="lumora-shell relative overflow-hidden">
      <div className="lumora-orb cyan h-72 w-72 left-[-80px] top-[120px]" />
      <div className="lumora-orb violet h-96 w-96 right-[-140px] top-[60px]" />
      <div className="lumora-orb pink h-72 w-72 left-[45%] bottom-[-120px]" />
      <div className="absolute inset-0 lumora-grid-bg opacity-30" />

      <LumoraTopNav />

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full lumora-glass mb-7">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,.95)]" />
            <span className="text-xs uppercase tracking-[0.24em] text-cyan-100/90">
              Runtime recovered · Visual shell active
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] lumora-glow-text">
            Lumora is becoming alive.
          </h1>

          <p className="mt-8 text-xl text-white/70 leading-relaxed max-w-3xl">
            One unified launch shell for FYP, Live, GMAR, NEXA, CineVerse,
            Echo, Zendoro, Zenwallet, creator systems, trust, safety, and
            the Zen Economy.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/fyp" className="rounded-2xl px-6 py-4 bg-cyan-300 text-slate-950 font-bold">
              Enter FYP
            </Link>
            <Link href="/live" className="rounded-2xl px-6 py-4 lumora-glass text-white font-bold">
              Open Live
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {portals.map((portal) => (
            <Link key={portal.href} href={portal.href} className="lumora-portal-card group p-6 min-h-[210px]">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                    {portal.signal}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.9)]" />
                </div>

                <h2 className="mt-8 text-3xl font-black">{portal.name}</h2>
                <p className="mt-4 text-white/65 leading-relaxed">{portal.desc}</p>

                <div className="mt-8 text-cyan-200 font-semibold">
                  Launch portal →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
