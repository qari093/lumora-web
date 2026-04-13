export type MoodBasedCinematicEditInput = {
  entityId: string;
  title: string;
  moodTags: string[];
  emotionalArc: string;
  sourceRef: string;
  createdAt: string;
};

export type MoodBasedCinematicEditOutput = {
  id: string;
  type: "mood-cinematic-edit";
  entityId: string;
  title: string;
  editConcept: string;
  emotionalArc: string;
  moodTags: string[];
  sourceRef: string;
  createdAt: string;
};

function buildEditConcept(input: MoodBasedCinematicEditInput): string {
  const tags = input.moodTags.filter(Boolean).slice(0, 3).join(", ");
  return tags.length > 0
    ? `${input.title} reframed through a cinematic mood edit: ${tags}.`
    : `${input.title} reframed through a cinematic mood edit.`;
}

export function buildMoodBasedCinematicEdit(
  input: MoodBasedCinematicEditInput
): MoodBasedCinematicEditOutput {
  return {
    id: `mood-cinematic-edit:${input.entityId}:${Date.parse(input.createdAt) || Date.now()}`,
    type: "mood-cinematic-edit",
    entityId: input.entityId,
    title: input.title,
    editConcept: buildEditConcept(input),
    emotionalArc: input.emotionalArc.trim(),
    moodTags: input.moodTags.filter(Boolean),
    sourceRef: input.sourceRef,
    createdAt: input.createdAt,
  };
}

export function isMoodBasedCinematicEditUsable(
  output: MoodBasedCinematicEditOutput
): boolean {
  return (
    output.title.trim().length > 0 &&
    output.editConcept.trim().length > 0 &&
    output.emotionalArc.trim().length > 0
  );
}
