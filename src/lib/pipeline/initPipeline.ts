import { feedEntry } from "./feedEntry";
import { connectIngestion } from "./ingestionConnect";
import { normalizeItems } from "./normalizeHook";
import { enrichItems } from "./enrichHook";

export function initPipeline(input:any){
  const entry = feedEntry(input);
  let items = connectIngestion(entry.items);
  items = normalizeItems(items);
  items = enrichItems(items);
  return { ...entry, items };
}
