import type { NextApiRequest, NextApiResponse } from "next";
import { generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";
import { getById, put } from "../../../lib/userStore";
import { requireAuth } from "./[...nextauth]";

const rpName = "Lumora";
const rpID = "127.0.0.1";
const origin = "http://127.0.0.1:3010";
const g:any = globalThis as any;
const store = g.__webauthn || (g.__webauthn = { challenges:{} as Record<string,string> });

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const session = await requireAuth(req,res); if(!session) return;
  const uid = (session as any).uid as string;
  const user = getById(uid)!;

  if(req.method==="GET"){
    const options = generateRegistrationOptions({
      rpName, rpID, userID: uid, userName: user.email,
      attestationType: "none",
      authenticatorSelection:{ residentKey:"preferred", userVerification:"preferred" }
    });
    store.challenges[uid] = options.challenge;
    return res.json({ ok:true, options });
  }
  if(req.method==="POST"){
    const attRes = req.body;
    const expectedChallenge = store.challenges[uid];
    const vr = await verifyRegistrationResponse({
      response: attRes, expectedChallenge, expectedOrigin: origin, expectedRPID: rpID,
    });
    if(!vr.verified) return res.status(400).json({ ok:false });
    user.webauthn = {
      credId: vr.registrationInfo!.credentialID,
      publicKey: vr.registrationInfo!.credentialPublicKey,
      counter: vr.registrationInfo!.counter
    };
    put(user);
    return res.json({ ok:true });
  }
  res.status(405).end();
}
