import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 20);
export async function POST(){
  const id=nanoid(), nonce=nanoid();
  const res=NextResponse.json({sessionId:id, nonce});
  res.cookies.set(`rbn_s_${id}`, JSON.stringify({id,startedAt:Date.now(),nonce}), { httpOnly:true, path:"/" });
  return res;
}
