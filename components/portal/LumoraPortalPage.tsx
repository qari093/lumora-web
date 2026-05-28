import Link from "next/link";
import LumoraTopNav from "@/components/navigation/LumoraTopNav";

type PortalAction = {
  label: string;
  href: string;
};

type PortalSignal = {
  label: string;
  value: string;
};

type PortalPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  actions: PortalAction[];
  signals: PortalSignal[];
  modules: string[];
};

export default function LumoraPortalPage({
  title,
  eyebrow,
  description,
  actions,
  signals,
  modules
}: PortalPageProps) {
  return (
    <main className="lumora-shell min-h-screen relative overflow-hidden">
      <div className="lumora-orb cyan h-72 w-72 left-[-90px] top-[150px]" />
      <div className="lumora-orb violet h-80 w-80 right-[-130px] top-[120px]" />
      <div className="absolute inset-0 lumora-grid-bg opacity-20" />

      <LumoraTopNav />

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="lumora-glass rounded-[36px] p-8 md:p-12">
          <div className="text-xs uppercase tracking-[0.26em] text-cyan-200/85">
            {eyebrow}
          </div>

          <h1 className="mt-5 text-5xl md:text-7xl font-black lumora-glow-text">
            {title}
          </h1>

          <p className="mt-7 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">
            {description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-2xl px-5 py-3 bg-white/10 border border-white/10 text-white hover:bg-white/15 transition"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {signals.map((signal) => (
            <div key={signal.label} className="lumora-glass rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                {signal.label}
              </div>
              <div className="mt-3 text-2xl font-black text-cyan-100">
                {signal.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {modules.map((module) => (
            <div key={module} className="lumora-portal-card p-6 min-h-[160px]">
              <div className="relative z-10">
                <div className="h-2 w-12 rounded-full bg-cyan-300/70 shadow-[0_0_18px_rgba(34,211,238,.75)]" />
                <h2 className="mt-6 text-xl font-black">{module}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/58">
                  Runtime surface is mounted, styled, and ready for live data wiring.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
