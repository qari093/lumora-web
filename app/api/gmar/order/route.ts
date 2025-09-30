import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const dir = () => path.join(process.cwd(), ".data", "gmar");
const fOrders = () => path.join(dir(), "orders.jsonl");

async function init(){
  await fs.mkdir(dir(), { recursive: true });
  try{ await fs.access(fOrders()); }catch{ await fs.writeFile(fOrders(), "", "utf8"); }
}
init().catch(()=>{});

export async function POST(req: Request){
  try{
    const b = await req.json();
    const order = {
      id: "o_"+Math.random().toString(36).slice(2,10),
      at: Date.now(),
      gameId: String(b.gameId||""),
      device: String(b.device||"unknown"),
      product: String(b.product||"unknown"),
      qty: Number(b.qty||1),
      price: Number(b.price||0),
      currency: String(b.currency||"€"),
      customer: {
        name: String(b.customer?.name||""),
        email: String(b.customer?.email||""),
        address: String(b.customer?.address||""),
      }
    };
    await fs.appendFile(fOrders(), JSON.stringify(order) + "\n", "utf8");
    return NextResponse.json({ ok:true, orderId: order.id });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: String(e?.message||e) }, { status: 400 });
  }
}
