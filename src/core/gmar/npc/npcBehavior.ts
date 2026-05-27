export type NPCState = {
  id: string;
  mood: string;
};

export function runNpcBehavior(id: string): NPCState {
  return {
    id,
    mood: "neutral"
  };
}
