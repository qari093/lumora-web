export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{lane:"priority-trailer",weight:1,enabled:true},
    ts:Date.now()
  });
}
