export type OfflineCertificate = {
  certificateId: string;
  walletId: string;
  balanceSnapshotHash: string;
  spendCap: number;
  usedAmount: number;
  sequence: number;
  expiresAt: number;
  signature: string;
};

export type OfflineJournalEntry = {
  id: string;
  certificateId: string;
  amount: number;
  sequence: number;
  status: "queued" | "confirmed" | "declined";
};

const journal: OfflineJournalEntry[] = [];

export function createOfflineCertificate(walletId: string, spendCap = 30): OfflineCertificate {
  const now = Date.now();
  return {
    certificateId: `oc_${walletId}_${now}`,
    walletId,
    balanceSnapshotHash: `snap_${walletId}_${spendCap}`,
    spendCap,
    usedAmount: 0,
    sequence: 0,
    expiresAt: now + 30 * 60 * 1000,
    signature: `sig_${walletId}_${now}`,
  };
}

export function queueOfflineSpend(cert: OfflineCertificate, amount: number): OfflineJournalEntry {
  const next = cert.sequence + 1;
  const status = cert.usedAmount + amount <= cert.spendCap && Date.now() <= cert.expiresAt ? "queued" : "declined";
  if (status === "queued") {
    cert.usedAmount += amount;
    cert.sequence = next;
  }
  const entry: OfflineJournalEntry = {
    id: `oj_${cert.certificateId}_${next}`,
    certificateId: cert.certificateId,
    amount,
    sequence: next,
    status,
  };
  journal.push(entry);
  return entry;
}

export function replayOfflineJournal() {
  return journal.map((entry) => ({ ...entry, status: entry.status === "queued" ? "confirmed" : entry.status }));
}

export function getOfflineJournal() {
  return journal;
}
