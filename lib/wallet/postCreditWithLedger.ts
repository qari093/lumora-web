export async function postCreditWithLedger(input: {
  userId: string;
  amount: number;
  source: string;
}) {
  try {
    const res = await fetch("/api/wallet/credit-ledger", {
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
