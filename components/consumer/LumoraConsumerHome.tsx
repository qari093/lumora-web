import Link from "next/link";

const portals = [
  {
    name: "For You",
    href: "/fyp",
    subtitle: "Your living discovery stream",
    tone: "from-fuchsia-500/30 to-cyan-400/20"
  },
  {
    name: "Live",
    href: "/live",
    subtitle: "Realtime rooms, presence, and creator energy",
    tone: "from-rose-500/30 to-orange-300/20"
  },
  {
    name: "GMAR",
    href: "/gmar",
    subtitle: "Games, challenges, rewards, and worlds",
    tone: "from-emerald-400/30 to-lime-300/20"
  },
  {
    name: "NEXA",
    href: "/nexa",
    subtitle: "Wellness, sanctuary, and self-upgrade",
    tone: "from-sky-400/30 to-indigo-400/20"
  },
  {
    name: "CineVerse",
    href: "/cineverse",
    subtitle: "Cinematic discovery and watch energy",
    tone: "from-violet-500/30 to-amber-300/20"
  },
  {
    name: "Wallet",
    href: "/wallet",
    subtitle: "Zencoin, rewards, and balance",
    tone: "from-yellow-400/30 to-emerald-300/20"
  },
  {
    name: "Profile",
    href: "/profile",
    subtitle: "Identity, privacy, and personal hub",
    tone: "from-slate-300/20 to-white/10"
  }
];

export default function LumoraConsumerHome() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050611] text-white">
      <section className="relative min-h-screen px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_25%,rgba(125,92,255,0.28),transparent_35%),radial-gradient(circle_at_15%_70%,rgba(0,255,200,0.18),transparent_30%),radial-gradient(circle_at_85%_72%,rgba(255,170,70,0.15),transparent_30%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <header className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-[0.28em] text-white">
            LUMORA
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <Link href="/fyp" className="hover:text-white">For You</Link>
            <Link href="/live" className="hover:text-white">Live</Link>
            <Link href="/gmar" className="hover:text-white">GMAR</Link>
            <Link href="/nexa" className="hover:text-white">NEXA</Link>
            <Link href="/cineverse" className="hover:text-white">CineVerse</Link>
          </nav>
          <Link
            href="/profile"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur hover:bg-white/15"
          >
            Enter
          </Link>
        </header>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <section>
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70 backdrop-blur">
              Production live · Consumer shell active · Lumora Ω∞
            </p>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
              A living digital atmosphere for discovery, presence, games, cinema, and wellbeing.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">
              Lumora is no longer a portal hub. It is one connected consumer universe: For You, Live,
              GMAR, NEXA, CineVerse, Wallet, and Profile — all flowing through one premium experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/fyp"
                className="rounded-full bg-white px-7 py-4 text-center text-sm font-bold text-black shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
              >
                Start For You
              </Link>
              <Link
                href="/live"
                className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-center text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                Enter Live
              </Link>
            </div>
          </section>

          <section className="relative">
            <div className="relative mx-auto aspect-square max-w-[560px] rounded-full border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-purple-500/10 backdrop-blur">
              <div className="absolute inset-10 rounded-full border border-white/10" />
              <div className="absolute inset-24 rounded-full border border-white/10" />
              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(145,120,255,0.55),rgba(45,20,120,0.1))] shadow-[0_0_80px_rgba(180,150,255,0.55)]" />
              {portals.slice(0, 6).map((portal, index) => {
                const positions = [
                  "left-[43%] top-[4%]",
                  "right-[5%] top-[30%]",
                  "right-[14%] bottom-[13%]",
                  "left-[15%] bottom-[12%]",
                  "left-[4%] top-[34%]",
                  "left-[42%] bottom-[3%]"
                ];
                return (
                  <Link
                    key={portal.name}
                    href={portal.href}
                    className={`absolute ${positions[index]} flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br ${portal.tone} p-3 text-center text-xs font-semibold text-white shadow-xl backdrop-blur transition hover:scale-105`}
                  >
                    {portal.name}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <section className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portals.map((portal) => (
            <Link
              key={portal.name}
              href={portal.href}
              className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${portal.tone} p-5 backdrop-blur transition hover:-translate-y-1 hover:border-white/25`}
            >
              <h2 className="text-xl font-bold">{portal.name}</h2>
              <p className="mt-2 text-sm leading-6 text-white/68">{portal.subtitle}</p>
              <p className="mt-4 text-xs font-semibold text-white/55 group-hover:text-white">Open →</p>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
