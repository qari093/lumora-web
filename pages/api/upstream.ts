import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.q || "").toLowerCase();
  res.status(200).json({ items: [
    { kind:"video",   id:"uv1", title:`${q||"demo"} — pro breakdown`, by:"LumaCoach", t:15 },
    { kind:"creator", id:"uc1", name:`${q||"demo"} Master`, followers: 42420 },
    { kind:"web",     url:"https://example.com/"+encodeURIComponent(q||"demo"), title:`Learn ${q||"demo"}`, site:"example.com" }
  ]});
}
