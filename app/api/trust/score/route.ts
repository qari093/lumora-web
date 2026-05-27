export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      trustScore:0.86,
      factors:["source","engagement","consistency"],
      enabled:true
    },
    ts:Date.now()
  });
}
