export const walletApis = {
  balanceApi: true,
  spendApi: true,
  historyApi: true,
  refundApi: true,
  exportApi: true
} as const;

export function apiHealth(): boolean {
  return (
    walletApis.balanceApi &&
    walletApis.spendApi &&
    walletApis.historyApi &&
    walletApis.refundApi &&
    walletApis.exportApi
  );
}
