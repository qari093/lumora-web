import { calendarReminder } from "@/lib/fomo/calendar/reminder";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:calendarReminder(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
