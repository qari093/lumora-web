import { guardedJson } from "@/lib/api/guardedJson";
import { translate } from "@/lib/format/translation/overlay";

export const dynamic = "force-dynamic";

export async function GET(){
  return guardedJson("api.format.translation",{ ok:true, data:translate("Hello"), ts:Date.now() });
}
