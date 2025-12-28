import PersonaBadge from "@/app/_client/persona/PersonaBadge";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div className="mb-3 flex items-center justify-between rounded-xl border bg-black/5 p-2">
        <div className="flex items-center gap-2">
          <PersonaBadge size={40} />
          <div className="text-sm font-medium">Lumexa Chat</div>
        </div>
        <a className="text-xs underline opacity-80 hover:opacity-100" href="/persona/select">Persona</a>
      </div>
      <h1 style={{ fontSize: 26, margin: "0 0 12px" }}>Lumexa — Open Talk</h1>
      <p style={{ opacity: 0.85, margin: 0 }}>
        Placeholder route (wired next step).
      </p>
      <div style={{ height: 14 }} />
      <a href="/lumexa" style={{ textDecoration: "underline" }}>← Back to Lumexa</a>
    </main>
  );
}
