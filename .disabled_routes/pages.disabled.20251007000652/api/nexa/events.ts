import type { NextApiRequest, NextApiResponse } from "next";
import { addClient, removeClient } from "../../lib/nexaStore";

export const config = { api: { bodyParser: false } };

export default function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=="GET") return res.status(405).end();
  const id = ;
  res.writeHead(200, {
    "Content-Type":"text/event-stream",
    "Cache-Control":"no-cache, no-transform",
    "Connection":"keep-alive",
    "Access-Control-Allow-Origin":"*"
  });
  res.write();
  addClient(id, (data)=>res.write(data));
  req.on("close", ()=> removeClient(id));
}
