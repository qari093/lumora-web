export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      reminderScheduling:true,
      schedules:["absolute-time","relative-time","event-based"],
      dedup:"per-user-per-event",
      enabled:true
    },
    ts:Date.now()
  });
}
