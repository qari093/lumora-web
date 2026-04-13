import { readQuarantineStore } from "@/lib/safety/quarantine/queue";

export async function validateZeroLeak() {
  const store = await readQuarantineStore();

  const leaked = store.items.filter(i => i.status === "queued" && (i as any).exposed === true);

  return {
    ok: leaked.length === 0,
    leakedCount: leaked.length,
    ts: Date.now(),
  };
}
