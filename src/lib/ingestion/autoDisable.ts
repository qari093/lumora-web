import { getHealth } from "./health";

export function shouldDisable(source:string){
  const h = getHealth(source);
  return h.fail > h.ok * 2;
}
