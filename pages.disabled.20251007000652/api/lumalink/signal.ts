import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req:NextApiRequest,res:NextApiResponse){
  // Socket.IO استعمال ہو رہا ہے — یہ صرف health/stub ہے۔
  res.status(200).json({ ok:true, via:"socket.io" });
}
