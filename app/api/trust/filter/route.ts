import { guardedJson } from "@/lib/api/guardedJson";
import {
  filterLowTrustSignals,
  readTrustedSignalStore,
} from "@/lib/trust/filterLowTrust";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();

  if (mode === "refresh") {
    const snapshot = await filterLowTrustSignals();
    return guardedJson("api.trust.filter", {
      ok: true,
      mode: "refresh",
      totalIn: snapshot.totalIn,
      totalOut: snapshot.totalOut,
      blocked: snapshot.blocked,
      updatedAt: snapshot.updatedAt,
      ts: Date.now(),
    });
  }

  const snapshot = await readTrustedSignalStore();
  return guardedJson("api.trust.filter", {
    ok: true,
    mode: "read",
    totalIn: snapshot.totalIn,
    totalOut: snapshot.totalOut,
    blocked: snapshot.blocked,
    updatedAt: snapshot.updatedAt,
    signals: snapshot.signals,
    ts: Date.now(),
  });
}
