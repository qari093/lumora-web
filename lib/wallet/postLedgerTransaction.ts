export async function postLedgerTransaction(input: {
  userId: string;
  amount: number;
  reference: string;
}) {
  try {
    const res = await fetch("/api/wallet/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
