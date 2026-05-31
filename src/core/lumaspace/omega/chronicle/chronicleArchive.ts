import type { ChronicleStory } from "./types";

export type ChronicleArchive = {
  ownerId: string;
  stories: ChronicleStory[];
};

export function createChronicleArchive(ownerId: string): ChronicleArchive {
  if (!ownerId.trim()) throw new Error("ownerId_required");
  return { ownerId, stories: [] };
}

export function addChronicleToArchive(
  archive: ChronicleArchive,
  story: ChronicleStory,
): ChronicleArchive {
  if (archive.ownerId !== story.ownerId) throw new Error("archive_owner_mismatch");

  return {
    ...archive,
    stories: [...archive.stories, story].sort((a, b) => b.monthKey.localeCompare(a.monthKey)),
  };
}
