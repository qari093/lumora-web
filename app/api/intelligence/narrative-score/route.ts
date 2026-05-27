export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      coherenceScore:0.82,
      factors:["continuity","engagement","novelty"],
      enabled:true
    },
    ts:Date.now()
  });
}
