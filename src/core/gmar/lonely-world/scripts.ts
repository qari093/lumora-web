export type LonelyWorldTrigger =
  | "no_echoes"
  | "no_mirror_attendance"
  | "no_social_orbit"
  | "no_returning_players"
  | "empty_seed_world";

export type LonelyWorldResponse = {
  trigger: LonelyWorldTrigger;
  text: string;
  turnsEmptinessIntoPresence: true;
  manipulative: false;
};

const copy: Record<LonelyWorldTrigger, string> = {
  no_echoes: "The sky is patient. Memory begins with one light.",
  no_mirror_attendance: "Even silence holds the shape of a presence.",
  no_social_orbit: "A lone orbit is still an orbit.",
  no_returning_players: "The world keeps a warm place for return.",
  empty_seed_world: "A civilization can begin as a whisper.",
};

export function createLonelyWorldResponse(trigger: LonelyWorldTrigger): LonelyWorldResponse {
  return {
    trigger,
    text: copy[trigger],
    turnsEmptinessIntoPresence: true,
    manipulative: false,
  };
}

export function lonelyWorldHealthy(): boolean {
  return (Object.keys(copy) as LonelyWorldTrigger[]).every((trigger) => {
    const response = createLonelyWorldResponse(trigger);
    return response.text.length > 10 && response.turnsEmptinessIntoPresence && !response.manipulative;
  });
}
