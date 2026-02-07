import { loadNexaGx } from "@/lib/nexa/loadGx";

export default function NexaPage() {
  const modules = loadNexaGx();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">NEXA</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map(m => (
          <a
            key={m.id}
            href={m.cta}
            className="rounded-xl border p-5 hover:bg-white/5 transition"
          >
            <div className="text-lg font-medium">{m.title}</div>
            <div className="text-sm opacity-70">{m.tagline}</div>
            <div className="mt-2 text-xs uppercase opacity-50">
              Status: {m.status}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
