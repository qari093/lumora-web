export type CountdownTrigger = {
  label: string;
  remainingSec: number;
  active: boolean;
};

export function buildCountdownTrigger(): CountdownTrigger {
  return {
    label: "Event starts soon",
    remainingSec: 300,
    active: true,
  };
}
