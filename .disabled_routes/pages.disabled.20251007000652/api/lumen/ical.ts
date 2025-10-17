import type { NextApiRequest, NextApiResponse } from "next";
import { listReminders } from "../../../lib/reminders";

function esc(s:string){ return String(s).replace(/([,;])/g,"\\$1"); }

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try{
    const items = (await listReminders()).filter(r=>r.enabled!==false);
    const lines: string[] = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");
    lines.push("PRODID:-//NEXA Lumen//Reminders//EN");

    for(const r of items){
      const dt = new Date(r.whenISO);
      const dtUTC = new Date(dt.getTime() - dt.getTimezoneOffset()*60000)
        .toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${r.id}@lumen-nexa`);
      lines.push(`DTSTAMP:${dtUTC}`);
      lines.push(`DTSTART:${dtUTC}`);
      lines.push(`SUMMARY:${esc(r.title)}`);
      if (r.repeat && r.repeat !== "NONE") {
        const map:any = { DAILY:"FREQ=DAILY", WEEKLY:"FREQ=WEEKLY", MONTHLY:"FREQ=MONTHLY" };
        lines.push(`RRULE:${map[r.repeat] || "FREQ=DAILY"}`);
      }
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    const text = lines.join("\r\n");
    res.setHeader("Content-Type","text/calendar; charset=utf-8");
    res.status(200).send(text);
  }catch{
    res.setHeader("Content-Type","text/calendar; charset=utf-8");
    res.status(200).send("BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n");
  }
}
