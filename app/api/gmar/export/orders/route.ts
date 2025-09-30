import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const fOrders = () => path.join(process.cwd(), ".data", "gmar", "orders.jsonl");

export async function GET() {
  try{
    let raw = "";
    try{ raw = await fs.readFile(fOrders(), "utf8"); }catch{ raw = ""; }
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const items = lines.map(l => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean) as any[];

    const esc = (s:string) => `"${String(s||"").replace(/"/g,)}"`;
    const header = [
      "orderId","timeISO","gameId","device","product","qty","price","currency",
      "name","email","address"
    ];
    const rows = [header.join(",")];
    for(const o of items){
      rows.push([
        esc(o.id),
        esc(new Date(o.at||0).toISOString()),
        esc(o.gameId),
        esc(o.device),
        esc(o.product),
        String(o.qty||1),
        String(o.price||0),
        esc(o.currency||"€"),
        esc(o.customer?.name||""),
        esc(o.customer?.email||""),
        esc(o.customer?.address||""),
      ].join(","));
    }
    const csv = rows.join("\r\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders.csv"`
      }
    });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
