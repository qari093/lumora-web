export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      throttling:true,
      limits:{perHour:3,perDay:10},
      strategy:"user-fatigue-protect",
      enabled:true
    },
    ts:Date.now()
  });
}
