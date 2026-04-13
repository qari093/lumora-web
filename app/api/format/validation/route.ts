import { guardedJson } from "@/lib/api/guardedJson";
import { validate } from "@/lib/format/validation/timing";

export const dynamic="force-dynamic";

export async function GET(){
  return guardedJson("api.format.validation",{ ok:true, result:validate(), ts:Date.now() });
}
