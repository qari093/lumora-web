import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req:NextApiRequest,res:NextApiResponse){
  const isProd = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", `uploader_consent=1; Path=/; Max-Age=31536000; SameSite=Lax; ${isProd?"Secure; ":""}`);
  res.status(200).json({ ok:true });
}
