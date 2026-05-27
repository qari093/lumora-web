export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      tuning:true,
      knobs:["countdown-intensity","replay-window","exclusivity-level"],
      mode:"operator-controlled",
      enabled:true
    },
    ts:Date.now()
  });
}
