export const runtime = "nodejs";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WalletDetailPage({
  params,
}: {
  params: { ownerId: string };
}) {
  const ownerId = decodeURIComponent(params.ownerId);
  const wallet = await prisma.wallet.findFirst({
    where: { ownerId, currency: "EUR" },
  });

  const ledgers = wallet
    ? await prisma.walletLedger.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <main className="p-6">
      <div className="mb-4">
        <Link href="/wallets" className="text-blue-600 underline">
          ← Back
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-2">Wallet: {ownerId}</h1>

      {!wallet ? (
        <p className="text-red-600">No wallet found.</p>
      ) : (
        <>
          <div className="mb-4 space-y-1">
            <div>
              Currency: <b>{wallet.currency}</b>
            </div>
            <div>
              Balance: <b>€{(wallet.balanceCents / 100).toFixed(2)}</b>
            </div>
            <div>Updated: {new Date(wallet.updatedAt).toLocaleString()}</div>
          </div>

          <h2 className="text-xl font-semibold mb-2">Recent ledger</h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">When</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Note</th>
                <th className="p-2 text-left">Ref</th>
              </tr>
            </thead>
            <tbody>
              {ledgers.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-2">{l.type}</td>
                  <td className="p-2">€{(l.amountCents / 100).toFixed(2)}</td>
                  <td className="p-2">{l.note ?? ""}</td>
                  <td className="p-2">
                    {[l.refType, l.refId].filter(Boolean).join(":")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
