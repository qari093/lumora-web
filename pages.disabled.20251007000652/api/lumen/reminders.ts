import type { NextApiRequest, NextApiResponse } from "next";
import { listReminders, createReminder, removeReminder, setEnabled } from "../../../lib/reminders";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try{
    if (req.method === "GET") {
      const items = await listReminders();
      return res.status(200).json({ ok:true, items });
    }
    if (req.method === "POST") {
      const { title, whenISO, repeat, enabled } = req.body || {};
      if (!title || !whenISO) return res.status(400).json({ ok:false, error:"title and whenISO required" });
      const r = await createReminder({ title, whenISO, repeat: repeat||"NONE", enabled: enabled ?? true });
      return res.status(201).json({ ok:true, item: r });
    }
    if (req.method === "DELETE") {
      const id = String(req.query.id || "");
      if (!id) return res.status(400).json({ ok:false, error:"id required" });
      const ok = await removeReminder(id);
      return res.status(200).json({ ok });
    }
    if (req.method === "PUT") {
      const id = String(req.query.id || "");
      const enabled = String(req.query.enabled || "") === "true";
      if (!id || typeof enabled!=="boolean") return res.status(400).json({ ok:false, error:"id and enabled required" });
      const ok = await setEnabled(id, enabled);
      return res.status(200).json({ ok });
    }
    return res.status(405).json({ ok:false, error:"method not allowed" });
  }catch(e:any){
    return res.status(500).json({ ok:false, error:String(e?.message||e) });
  }
}
