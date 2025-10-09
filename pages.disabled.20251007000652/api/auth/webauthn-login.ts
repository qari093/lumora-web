import type { NextApiRequest, NextApiResponse } from "next";
import { generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { getById } from "../../../lib/userStore";
import { requireAuth } from "./[...nextauth]";

const rpID = "127.0.0.1";
const origin = "http://127.0.0.1:3010";
const g:any = globalThis as any;
const store = g.__webauthn || (g.__webauthn = { challenges:{} as Record<string,string> });

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const session = await requireAuth(req,res); if(!session) return;
  const uid = (session as any).uid as string;
  const user = getById(uid)!;
  if(!user.webauthn) return res.status(400).json({ ok:false, error:"no_credential" });

  if(req.method==="GET"){
    const options = generateAuthenticationOptions({
      rpID,
      allowCredentials:[{ id:user.webauthn.credId, type:"public-key" }],
      userVerification:"preferred"
    });
    store.challenges[uid] = options.challenge;
    return res.json({ ok:true, options });
  }
  if(req.method==="POST"){
    const vr = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: store.challenges[uid],
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: user.webauthn!.credId,
        credentialPublicKey: user.webauthn!.publicKey,
        counter: user.webauthn!.counter,
        transports: undefined
      }
    });
    if(!vr.verified) return res.status(400).json({ ok:false });
    user.webauthn!.counter = vr.authenticationInfo.newCounter;
    return res.json({ ok:true, stepUp:true });
  }
  res.status(405).end();
}
