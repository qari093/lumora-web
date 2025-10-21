export const runtime = "nodejs";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WalletsPage() {
  const wallets = await prisma.wallet.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Wallets</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Owner</th>
            <th className="p-2 text-left">Currency</th>
            <th className="p-2 text-left">Balance</th>
            <th className="p-2 text-left">Updated</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((w) => (
            <tr key={w.id} className="border-t">
              <td className="p-2">
                <Link
                  href={`/wallets/${encodeURIComponent(w.ownerId)}`}
                  className="text-blue-600 underline"
                >
                  {w.ownerId}
                </Link>
              </td>
              <td className="p-2">{w.currency}</td>
              <td className="p-2">€{(w.balanceCents / 100).toFixed(2)}</td>
              <td className="p-2">{new Date(w.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
