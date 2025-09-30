import { loadJson, saveJson, dataPath } from "./fsStore";

export type Order = { id:string; productId:string; title:string; price:number; qty:number; total:number; createdAt:string; status:"PENDING"|"CONFIRMED" };
const FILE = dataPath("orders.json");

export async function createOrder(p:{productId:string; title:string; price:number; qty:number}):Promise<Order>{
  const arr = await loadJson<Order[]>(FILE,[]);
  const id = "ord_"+Math.random().toString(36).slice(2,10);
  const total = +(p.price * p.qty).toFixed(2);
  const o:Order = { id, productId:p.productId, title:p.title, price:p.price, qty:p.qty, total, createdAt:new Date().toISOString(), status:"PENDING" };
  arr.push(o); await saveJson(FILE, arr); return o;
}
