import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn({ providers }: any) {
  const [email,setEmail]=useState("demo@lumora.ai");
  const [password,setPassword]=useState("demo123");
  return (
    <div style={{maxWidth:420,margin:"40px auto",fontFamily:"system-ui"}}>
      <h2>Lumora — Secure Sign In</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:10,margin:"8px 0"}}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:10,margin:"8px 0"}}/>
      <button onClick={()=>signIn("credentials",{ email, password, callbackUrl:"/nexa" })} style={{padding:10,width:"100%"}}>Sign in</button>
      <p style={{opacity:.7,marginTop:10}}>Dev: credentials auto-provision on first sign in.</p>
    </div>
  );
}
SignIn.getInitialProps = async () => ({ providers: await getProviders() });
