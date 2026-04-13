export async function checkTransactionIdRequest(input: {
  transactionId: string;
  existingIds?: string[];
}) {
  try {
    const res = await fetch("/api/wallet/txid-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return {
      status: res.status,
      data: await res.json(),
    };
  } catch {
    return null;
  }
}
