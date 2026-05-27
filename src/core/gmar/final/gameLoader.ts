import { AAA_GAMES } from "./gameRegistry";

export function loadGame(name: string) {
  return AAA_GAMES.includes(name);
}
