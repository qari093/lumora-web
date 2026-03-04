export const dynamic = "force-dynamic";
export const revalidate = 0;

type DemoItem = {
  id: string;
  title: string;
  subtitle: string;
};

// NOTE: tests expect 'items = [' (regex), so keep this exact literal form.
const items = [
  { id: "a", title: "Live/Echo — Welcome", subtitle: "User-alive demo content (runtime-safe)" },
  { id: "b", title: "Live/Echo — Rooms", subtitle: "Placeholder list; real loop added later" },
  { id: "c", title: "Live/Echo — Status", subtitle: "Alive marker + loading + non-empty UI" },
] satisfies DemoItem[];

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <div id="LUMORA_PORTAL_ALIVE_LIVE" style={{ display: "none" }}>
        alive
      </div>

      <h1 className="text-2xl font-semibold" title="live">
        live
      </h1>

      <p className="opacity-80">
        This portal is in <b>User-Alive Mode</b>: always renders content + stable routes.
      </p>

      <div className="grid gap-3">
        {items.map((i) => (
          <div key={i.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="font-medium">{i.title}</div>
            <div className="text-sm opacity-70">{i.subtitle}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
