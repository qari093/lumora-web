import { createWalletCredit } from "@/lib/surge/walletCredit";
import { createLedgerTransaction } from "@/lib/wallet/ledger";

export function creditWithLedger(input: {
  userId: string;
  amount: number;
  source: string;
}) {
  const amount = Math.max(0, Math.floor(input.amount || 0));

  const credit = createWalletCredit({
    userId: input.userId,
    amount,
    source: input.source,
  });

  const ledger = createLedgerTransaction({
    userId: input.userId,
    amount,
    reference: input.source,
  });

  return {
    credit,
    ledger,
  };
}
