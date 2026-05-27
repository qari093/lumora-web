export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      linking:true,
      linkTypes:["topic","event","creator","timeline"],
      enabled:true
    },
    ts:Date.now()
  });
}
