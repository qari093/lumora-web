export type Seller = {
  id: string;
  name: string;
  active: boolean;
};

const sellers = new Map<string, Seller>();

export function registerSeller(id: string, name: string) {
  const seller: Seller = {
    id,
    name,
    active: true,
  };

  sellers.set(id, seller);

  return seller;
}

export function disableSeller(id: string) {
  const seller = sellers.get(id);

  if (!seller) {
    throw new Error("SELLER_NOT_FOUND");
  }

  seller.active = false;

  return seller;
}

export function getSeller(id: string) {
  return sellers.get(id) ?? null;
}
