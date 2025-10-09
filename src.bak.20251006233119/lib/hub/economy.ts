const ls = (k:string, v?:any) => {
  if (typeof window==="undefined") return null;
  if (v===undefined) {
    const raw = localStorage.getItem(k);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  } else {
    localStorage.setItem(k, JSON.stringify(v));
    return v;
  }
};

const COINS_KEY = "zen.wallet.coins";
const INV_KEY = "zen.inventory";
const BEST_KEY = (id:string)=>`zen.best.${id}`;

export function loadCoins(): number { return Number(ls(COINS_KEY) ?? 0); }
export function addCoins(n:number): number { const c=Math.max(0, loadCoins()+n); ls(COINS_KEY,c); return c; }
export function spendCoins(n:number): number|null { const c=loadCoins(); if(c<n) return null; const r=c-n; ls(COINS_KEY,r); return r; }

export type InvItem = { id:string; title?:string; qty:number };
export type Inventory = { coins:number; items: InvItem[] };

export function loadInv(): Inventory {
  return ls(INV_KEY) ?? { coins: loadCoins(), items: [] };
}
export function saveInv(inv: Inventory){ ls(INV_KEY, inv); ls(COINS_KEY, inv.coins); }
export function addItem(id:string, title:string="Item", qty=1){
  const inv = loadInv();
  const f = inv.items.find(i=>i.id===id);
  if (f) f.qty += qty; else inv.items.push({id,title,qty});
  inv.coins = loadCoins();
  saveInv(inv);
  return inv;
}

export function loadBest(gameId:string): number { return Number(ls(BEST_KEY(gameId)) ?? 0); }
export function saveBest(gameId:string, v:number){ ls(BEST_KEY(gameId), v); }
