import Link from "next/link";

type PortalAction = {
  label: string;
  href: string;
};

type PortalSignal = {
  label: string;
  value: string;
};

type LumoraPortalPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  actions?: PortalAction[];
  signals?: PortalSignal[];
  modules?: string[];
};

export default function LumoraPortalPage({
  title,
  eyebrow,
  description,
  actions = [],
  signals = [],
  modules = [],
}: LumoraPortalPageProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_34%),#050711] px-5 py-8 text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-7">
        <Link href="/" className="text-sm text-cyan-200/80">
          ← Lumora Home
        </Link>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
            {eyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            {description}
          </p>

          {actions.length > 0 ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  style={{
                    position: "relative",
                    zIndex: 30,
                    pointerEvents: "auto",
                    display: "inline-flex",
                    cursor: "pointer",
                    touchAction: "manipulation"
                  }}
                  className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        {signals.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-3">
            {signals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  {signal.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {signal.value}
                </p>
              </div>
            ))}
          </section>
        ) : null}

        {modules.length > 0 ? (
          <section className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
            <h2 className="text-xl font-semibold">Available inside this portal</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <div
                  key={module}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200"
                >
                  {module}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
