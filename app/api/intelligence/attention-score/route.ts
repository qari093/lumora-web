export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      attentionScore:0.84,
      factors:["watch-time","replay","velocity"],
      enabled:true
    },
    ts:Date.now()
  });
}
