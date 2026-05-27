export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      emotionalProfile:true,
      dimensions:["excitement","curiosity","calm","tension"],
      source:"interaction-derived",
      enabled:true
    },
    ts:Date.now()
  });
}
