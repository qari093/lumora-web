const TONAL_PREVIEWS = [
  "Something quiet is forming",
  "A cinematic drift approaches",
  "Tomorrow carries warmth",
  "A strange beauty is arriving"
];

export function getTomorrowsVibe() {
  return TONAL_PREVIEWS[
    Math.floor(Math.random() * TONAL_PREVIEWS.length)
  ];
}
