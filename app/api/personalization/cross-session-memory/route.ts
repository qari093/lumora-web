export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      crossSessionMemory:true,
      memoryWindowDays:30,
      stores:["interest-state","pace-state","emotion-state"],
      enabled:true
    },
    ts:Date.now()
  });
}
