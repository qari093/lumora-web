import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Tx = { id:string; at:number; device:string; action:"earn"|"spend"|"refund"; amount:number; reason?:string; opId?:string };
type Ledger = {
  balances: Record<string, number>;
  history: Record<string, Tx[]>;
  ops: Record<string, boolean>; // idempotency per device:device_opId
};
const FILE = path.join(process.cwd(), ".data/zen/ledger.json");
function load(): Ledger {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { balances: {}, history: {}, ops: {} };
  }
}
function save(l: Ledger) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(l, null, 2));
}
function dev(req: NextRequest) {
  return (req.headers.get("x-device-id") || "dev-"+req.headers.get("x-forwarded-for") || "dev-127.0.0.1");
}

export async function GET(req: NextRequest) {
  const d = dev(req);
  const l = load();
  const balance = l.balances[d] || 0;
  const history = l.history[d] || [];
  return NextResponse.json({ ok: true, device: d, balance, history });
}

export async function POST(req: NextRequest) {
  const d = dev(req);
  const body = await req.json().catch(()=> ({}));
  const { action, amount, reason, opId } = body || {};
  if (!["earn","spend","refund"].includes(action)) {
    return NextResponse.json({ ok:false, error:"invalid_action" }, { status:400 });
  }
  const n = Number(amount || 0);
  if (!Number.isFinite(n) || n<=0) {
    return NextResponse.json({ ok:false, error:"invalid_amount" }, { status:400 });
  }

  const l = load();
  l.balances[d] = l.balances[d] || 0;
  l.history[d] = l.history[d] || [];

  // idempotency
  if (opId) {
    const key = d+":"+opId;
    if (l.ops[key]) {
      return NextResponse.json({ ok: true, device: d, balance: l.balances[d], duplicate: true });
    }
    l.ops[key] = true;
  }

  if (action==="earn" || action==="refund") {
    l.balances[d] += n;
  } else if (action==="spend") {
    if (l.balances[d] < n) {
      return NextResponse.json({ ok:false, error:"insufficient_balance", balance: l.balances[d] }, { status:400 });
    }
    l.balances[d] -= n;
  }

  const tx:Tx = { id:"tx_"+Math.random().toString(36).slice(2,10), at:Date.now(), device:d, action, amount:n, reason, opId };
  l.history[d].unshift(tx);
  if (l.history[d].length>1000) l.history[d].length=1000;

  save(l);
  return NextResponse.json({ ok: true, device:d, balance: l.balances[d], duplicate:false });
}
