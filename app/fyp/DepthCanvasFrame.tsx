import type { ReactNode } from "react";
import {
  FYP_DEPTHCANVAS_ACTIONS,
  FYP_DEPTHCANVAS_BOTTOM_NAV,
  FYP_DEPTHCANVAS_LANES
} from "@/src/core/fyp/ui/depthCanvasModel";

export default function DepthCanvasFrame({
  children
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03040a] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_15%,rgba(45,212,191,0.24),transparent_34%),radial-gradient(circle_at_12%_72%,rgba(99,102,241,0.20),transparent_30%),linear-gradient(180deg,#03040a_0%,#07111f_52%,#020309_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,0.58),transparent_28%,transparent_72%,rgba(0,0,0,0.58)),linear-gradient(180deg,rgba(0,0,0,0.42),transparent_22%,transparent_70%,rgba(0,0,0,0.72))]"
      />

      <section className="relative z-[2] min-h-screen">
        {children}
      </section>

      <aside className="pointer-events-none fixed right-3 top-1/2 z-[30] flex -translate-y-1/2 flex-col gap-3">
        {FYP_DEPTHCANVAS_ACTIONS.map(action => (
          <button
            key={action}
            type="button"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/45 text-[10px] font-semibold text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.22)] backdrop-blur-xl active:scale-95"
            aria-label={`FYP ${action}`}
          >
            {action}
          </button>
        ))}
      </aside>

      <div className="pointer-events-none fixed bottom-24 left-0 right-0 z-[30] flex gap-2 overflow-x-auto px-4">
        {FYP_DEPTHCANVAS_LANES.map(lane => (
          <span
            key={lane}
            className="rounded-full border border-cyan-200/20 bg-black/45 px-4 py-2 text-xs font-semibold text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.16)] backdrop-blur-xl"
          >
            {lane}
          </span>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-[35] grid grid-cols-5 border-t border-white/10 bg-black/55 px-2 py-3 text-center text-[11px] font-semibold text-slate-200 backdrop-blur-xl">
        {FYP_DEPTHCANVAS_BOTTOM_NAV.map(item => (
          <a
            key={item}
            href={item === "Live" ? "/live" : item === "Space" ? "/lumaspace" : "/fyp"}
            className="rounded-full px-2 py-2 transition hover:bg-white/10"
          >
            {item}
          </a>
        ))}
      </nav>
    </main>
  );
}
