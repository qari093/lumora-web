export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      countdowns:true,
      types:["event","trailer","limited-window"],
      timers:["live","scheduled"],
      enabled:true
    },
    ts:Date.now()
  });
}
