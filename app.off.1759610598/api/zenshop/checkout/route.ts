import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LEDGER = path.join(process.cwd(), ".data/zen/ledger.json");
const INV = path.join(process.cwd(), ".data/zenshop/inventory.json");

function loadLedger(){ try{return JSON.parse(fs.readFileSync(LEDGER,"utf-8"));}catch{return {balances:{},history:{},ops:{}};} }
function saveLedger(d:any){ fs.mkdirSync(path.dirname(LEDGER),{recursive:true}); fs.writeFileSync(LEDGER, JSON.stringify(d,null,2)); }

function loadInv(){ try{return JSON.parse(fs.readFileSync(INV,"utf-8"));}catch{return {};} }
function saveInv(d:any){ fs.mkdirSync(path.dirname(INV),{recursive:true}); fs.writeFileSync(INV, JSON.stringify(d,null,2)); }

const PRODUCTS = [
  { id: "skin_aurora", title: "Aurora Hero Skin", priceZen: 7, type: "skin", hero: "Aurora" },
  { id: "skin_raven",  title: "Raven Hero Skin",  priceZen: 7, type: "skin", hero: "Raven"  },
  { id: "skin_blaze",  title: "Blaze Hero Skin",  priceZen: 7, type: "skin", hero: "Blaze"  },
  { id: "skin_hawk",   title: "Hawk Hero Skin",   priceZen: 7, type: "skin", hero: "Hawk"   },
  { id: "bundle_boost", title: "Boost Bundle (x3)", priceZen: 5, type: "boost", qty: 3 }
];

export async function POST(req: NextRequest){
  const dev = (req.headers.get("x-device-id") || "dev-"+(req.headers.get("x-forwarded-for")||"127.0.0.1"));
  const body = await req.json().catch(()=> ({}));
  const { productId, payment } = body || {};
  if(!productId) return NextResponse.json({ ok:false, error:"missing_product" }, {status:400});

  const prod = PRODUCTS.find(p=>p.id===productId);
  if(!prod) return NextResponse.json({ ok:false, error:"invalid_product" }, {status:404});
  if(payment!=="zen") return NextResponse.json({ ok:false, error:"unsupported_payment" }, {status:400});

  const l = loadLedger();
  l.balances[dev] = l.balances[dev] || 0;
  if(l.balances[dev] < prod.priceZen){
    return NextResponse.json({ ok:false, error:"insufficient_zen", balance:l.balances[dev] }, {status:400});
  }
  l.balances[dev] -= prod.priceZen;
  const tx = { id:"tx_"+Math.random().toString(36).slice(2,10), at:Date.now(), device:dev, action:"spend", amount:prod.priceZen, reason:"zenshop:"+prod.id };
  l.history[dev] = l.history[dev] || [];
  l.history[dev].unshift(tx);
  saveLedger(l);

  const inv = loadInv();
  inv[dev] = inv[dev] || { device: dev, items: [], boosts: 0 };
  if(prod.type==="skin"){
    if(!inv[dev].items.includes(prod.id)) inv[dev].items.push(prod.id);
  } else if(prod.type==="boost"){
    inv[dev].boosts = (inv[dev].boosts||0) + (prod as any).qty;
  }
  saveInv(inv);

  return NextResponse.json({ ok:true, device:dev, purchased:prod.id, balance: l.balances[dev], inventory: inv[dev] });
}
