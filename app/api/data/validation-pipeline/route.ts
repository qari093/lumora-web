export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      validation:true,
      checks:["schema","required-fields","type-safety"],
      enabled:true
    },
    ts:Date.now()
  });
}
