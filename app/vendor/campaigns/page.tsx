import { OWNER_ID } from "@/src/app/vendor/owner";

export const dynamic = "force-dynamic";

async function getCampaigns() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/vendor/campaigns?ownerId=${OWNER_ID}`, { cache: "no-store" });
  if (!res.ok) throw new Error("campaigns fetch failed");
  return res.json();
}

export default async function Page() {
  const data = await getCampaigns();
  const rows = (data?.campaigns ?? []) as any[];
  return (
    <main>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Campaigns — {OWNER_ID}</h1>
      <div style={{ fontSize: 13, marginBottom: 12 }}>
        Budget total: €{data?.aggregates?.budgetTotal?.toFixed?.(2) ?? "0.00"} ·{" "}
        Spent: €{data?.aggregates?.spentEuros?.toFixed?.(2) ?? "0.00"} ·{" "}
        Remaining: €{data?.aggregates?.remainingEuros?.toFixed?.(2) ?? "0.00"}
      </div>
      <table style={{ borderCollapse:"collapse", width:"100%" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">State</th>
            <th align="right">Budget</th>
            <th align="right">Spent</th>
            <th align="right">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.state}</td>
              <td align="right">€{(c.budgetEuros ?? 0).toFixed(2)}</td>
              <td align="right">€{(c.spentEuros ?? 0).toFixed(2)}</td>
              <td align="right">€{(c.remainingEuros ?? 0).toFixed(2)}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={5}>No campaigns.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
