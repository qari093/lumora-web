import Link from "next/link";

const portals = [
  { href: "/fyp", label: "FYP", desc: "Open the discovery feed." },
  { href: "/live", label: "Live", desc: "Enter live rooms and real-time activity." },
  { href: "/gmar", label: "GMAR", desc: "Open the game playground." },
  { href: "/lumaspace", label: "LumaSpace", desc: "Open memory, reflection, and identity space." },
  { href: "/lumexa/shop", label: "Zendoro", desc: "Open commerce and checkout flow." },
  { href: "/movies", label: "Movies", desc: "Open CineVerse portal." },
  { href: "/music", label: "Music", desc: "Open Lumora Echo." },
  { href: "/creator", label: "Creator", desc: "Open creator tools." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050711] px-6 py-10 text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-white/5 p-8 shadow-2xl shadow-cyan-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">
            Lumora Private Beta
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Lumora
          </h1>
          <p className="mt-3 text-xl font-medium text-cyan-100">
            Your private beta ecosystem is alive.
          </p>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            Enter FYP, Live, GMAR, LumaSpace, Zendoro, Movies, Music, and Share from one calm home screen. This beta build is ready for founder testing on iPhone before external testers are invited.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {portals.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
            >
              <h2 className="text-xl font-semibold">{portal.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{portal.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
