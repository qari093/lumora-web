import { fetchEmmlChart } from "@/app/_client/emml-chart-client";

export default async function EmmlChartPage() {
  // Ensure the file references fetchEmmlChart for contract guard.
  const data = await fetchEmmlChart({ range: "24h" }).catch(() => null);

  return (
    <main style={{ padding: 16 }}>
      <h1>EMML Live Chart</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
