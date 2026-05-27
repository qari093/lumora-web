export function createReceiptFingerprint(txId: string) {
  return `ZP-${txId.slice(0, 4).toUpperCase()}`;
}
