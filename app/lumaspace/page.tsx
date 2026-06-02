import LumaSpaceInteractionPanel from "@/components/lumaspace/interactions/LumaSpaceInteractionPanel";
import Link from "next/link";

export default function LumaSpacePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-200">
          Lumora Civilization Layer
        </p>

        <h1 className="text-4xl font-semibold tracking-tight">
          LumaSpace
        </h1>

        <p className="mt-4 max-w-2xl text-white/75">
          Your private reflection, memory, identity, and civilization space inside Lumora.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/lumaspace/dashboard" className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            Open Dashboard
          </Link>

          <Link href="/lumaspace/journal" className="rounded-2xl border border-violet-300/20 bg-violet-300/10 p-5">
            Open Journal
          </Link>

          <Link href="/lumaspace/memory" className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
            Open Memory
          </Link>

          <Link href="/lumaspace/reflection" className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
            Open Reflection
          </Link>
        </div>
      </section>
          <LumaSpaceInteractionPanel />
    </main>
  );
}