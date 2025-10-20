const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const ADMIN = process.env.ADMIN_TOKEN || "dev-admin-token";

async function j(p, init){ const r=await fetch(BASE+p, init); let d=null; try{ d=await r.json(); }catch{} return {s:r.status,d,h:r.headers}; }
async function post(p,b,h={}){ return j(p,{method:"POST", headers:{ "content-type":"application/json", ...h }, body:JSON.stringify(b)}); }
async function get(p,h={}){ return j(p,{headers:h}); }

(async()=>{
  const ownerId = "OWNER_LINK_"+Date.now();

  // 1) Create a KYC request
  const req = await post("/api/kyc/request", { ownerId, legalName:"Wallet Link", email:"wallet@example.com" });
  if (req.s >= 400) throw new Error("KYC request failed: "+JSON.stringify(req.d));

  // 2) Look up the request deterministically via status (avoids relying on /admin/kyc/pending filters)
  const status = await get(`/api/kyc/status?ownerId=${encodeURIComponent(ownerId)}`);
  const requestId = status?.d?.request?.id;
  if (!requestId) throw new Error("Could not resolve KYC request id via /api/kyc/status");

  // 3) Approve it via admin endpoint (token-gated)
  const dec = await post("/api/admin/kyc/decision",
    { requestId, decision:"APPROVED", reason:"ok", adminUser:"admin" },
    { "x-admin-token": ADMIN }
  );
  if (dec.s >= 400) throw new Error("Admin decision failed: "+JSON.stringify(dec.d));

  // 4) Ensure/read wallet
  let w = await get(`/api/wallets/${encodeURIComponent(ownerId)}`);
  if (!(w.d && w.d.wallet)) {
    await post("/api/wallets/ensure", { ownerId });
    w = await get(`/api/wallets/${encodeURIComponent(ownerId)}`);
  }

  console.log(JSON.stringify({
    ownerId,
    kycRequestStatus: req.s,
    requestId,
    decisionStatus: dec.s,
    walletStatus: w.s,
    wallet: w.d?.wallet
  }, null, 2));
})().catch(e=>{ console.error("SMOKE ERR:", e?.message||e); process.exit(1); });
