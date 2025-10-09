import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export default function SecuritySettings(){
  const { data:session, status } = useSession();
  const [totp, setTotp] = useState<{secret?:string;otpauth?:string; enabled?:boolean}|null>(null);
  const [codes, setCodes] = useState<string[]|null>(null);
  const authed = status==="authenticated";

  async function getProvision(){ const r = await fetch("/api/auth/totp"); const j = await r.json(); setTotp(j.ok? j : null); }
  async function verifyTotp(token:string){ const r = await fetch("/api/auth/totp",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ token })}); const j = await r.json(); if(j.ok) setTotp({ enabled:true }); }
  async function disableTotp(){ await fetch("/api/auth/totp",{ method:"DELETE" }); setTotp({ enabled:false }); }
  async function genBackup(){ const r=await fetch("/api/auth/backup-codes",{method:"POST"}); const j=await r.json(); if(j.ok) setCodes(j.codes); }
  async function registerWebAuthn(){
    const regOpts = await (await fetch("/api/auth/webauthn-register")).json();
    if(!regOpts.ok) return;
    const att = await startRegistration(regOpts.options);
    await fetch("/api/auth/webauthn-register",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(att) });
  }
  async function loginWebAuthn(){
    const authOpts = await (await fetch("/api/auth/webauthn-login")).json();
    if(!authOpts.ok) return;
    const resp = await startAuthentication(authOpts.options);
    await fetch("/api/auth/webauthn-login",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(resp) });
    alert("Step-up OK via WebAuthn");
  }

  if(!authed) return <div style={{maxWidth:720,margin:"40px auto",fontFamily:"system-ui"}}><h2>Security</h2><p>Please sign in first.</p></div>;
  return (
    <div style={{maxWidth:720,margin:"40px auto",fontFamily:"system-ui",lineHeight:1.5}}>
      <h2>Security</h2>
      <section style={{padding:"16px",border:"1px solid #eee",borderRadius:8,marginBottom:16}}>
        <h3 style={{marginTop:0}}>Two-Factor (TOTP)</h3>
        {!totp?.enabled ? (
          <>
            {!totp?.secret ? <button onClick={getProvision}>Enable TOTP</button> : (
              <div>
                <p><b>Secret:</b> {totp.secret}</p>
                <p style={{opacity:.7}}>Add to your authenticator app, then enter the 6-digit code:</p>
                <TotpVerify onVerify={verifyTotp}/>
              </div>
            )}
          </>
        ) : (<>
          <p>✅ TOTP enabled</p>
          <button onClick={disableTotp}>Disable</button>
        </>)}
      </section>

      <section style={{padding:"16px",border:"1px solid #eee",borderRadius:8,marginBottom:16}}>
        <h3 style={{marginTop:0}}>Backup Codes</h3>
        <button onClick={genBackup}>Generate (show once)</button>
        {codes && (
          <div>
            <p>Store these offline:</p>
            <pre style={{whiteSpace:"pre-wrap"}}>{codes.join("  ")}</pre>
          </div>
        )}
      </section>

      <section style={{padding:"16px",border:"1px solid #eee",borderRadius:8}}>
        <h3 style={{marginTop:0}}>Passkeys (WebAuthn)</h3>
        <button onClick={registerWebAuthn} style={{marginRight:8}}>Register this device</button>
        <button onClick={loginWebAuthn}>Test step-up</button>
      </section>
    </div>
  );
}

function TotpVerify({ onVerify }:{ onVerify:(code:string)=>any }){
  const [code,setCode]=useState("");
  return (
    <div>
      <input placeholder="123456" value={code} onChange={e=>setCode(e.target.value)} style={{padding:8,marginRight:8}}/>
      <button onClick={()=>onVerify(code)}>Verify</button>
    </div>
  );
}
