import { getSources } from "./registry";

export function loadSources(){
  return getSources().map(s => ({ name: s, active: true }));
}
