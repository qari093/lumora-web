export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{source:"feed",eventTypes:["view","click","share"],enabled:true},
    ts:Date.now()
  });
}
