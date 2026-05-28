const vibes = [
  "Something quiet is forming.",
  "Tomorrow carries cinematic energy.",
  "A strange emotional drift is approaching.",
  "A calm memory may find you tomorrow.",
  "A beautiful interruption is waiting."
];

export function generateTomorrowsVibe(): string {
  return vibes[Math.floor(Math.random() * vibes.length)];
}
