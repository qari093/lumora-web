export const commerceCore = {
  catalog: true,
  cart: true,
  checkout: true,
  orders: true,
  refunds: true,
  shipping: true
} as const;

export function commerceCoreHealthy(): boolean {
  return (
    commerceCore.catalog &&
    commerceCore.cart &&
    commerceCore.checkout &&
    commerceCore.orders &&
    commerceCore.refunds &&
    commerceCore.shipping
  );
}
