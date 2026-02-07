import PortalHero from "@/components/portals/PortalHero";
import { loadFypFeed } from "@/lib/fyp/loadFeed";

export default function FypPage() {
  const items = loadFypFeed();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">FYP</h1>
      {items.map(i => (
        <div key={i.id} className="rounded-xl border p-4">
          <div className="font-medium">{i.title}</div>
          <div className="text-sm opacity-70">{i.subtitle}</div>
        </div>
      ))}
    </main>
  );
}
