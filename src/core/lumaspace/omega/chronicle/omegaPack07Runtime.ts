import { createChronicleMoment } from "./chronicleCollector";
import { buildChronicleStory, enableChronicleSharing } from "./chronicleBuilder";
import { createChronicleRenderPlan } from "./chronicleRenderer";
import { createChronicleArchive, addChronicleToArchive } from "./chronicleArchive";

export function runLumaSpaceOmegaMegaPack07Runtime() {
  const ownerId = "omega-citizen-007";

  const moments = [
    createChronicleMoment({
      id: "moment-first-bridge",
      sourceMemoryId: "memory-first-bridge",
      title: "Your first Constellation Bridge formed",
      summary: "A new relationship thread began glowing.",
      emotionalWeight: 94,
      contributionWeight: 70,
      connectionWeight: 98,
    }),
    createChronicleMoment({
      id: "moment-mission",
      sourceMemoryId: "memory-mission",
      title: "You helped a Crystal Mission move forward",
      summary: "Your contribution pushed the shared light higher.",
      emotionalWeight: 88,
      contributionWeight: 96,
      connectionWeight: 76,
    }),
  ];

  const story = enableChronicleSharing(
    buildChronicleStory({
      ownerId,
      ownerName: "Waqar",
      scope: "personal",
      monthKey: "2026-05",
      moments,
    }),
  );

  const renderPlan = createChronicleRenderPlan(story);
  const archive = addChronicleToArchive(createChronicleArchive(ownerId), story);

  return {
    ok:
      story.shareable &&
      story.narration.includes("From your Space") &&
      story.invitationLine === "Join me on LumaSpace." &&
      renderPlan.format === "vertical_short" &&
      renderPlan.segments.length === 2 &&
      archive.stories.length === 1,
    moments,
    story,
    renderPlan,
    archive,
  };
}
