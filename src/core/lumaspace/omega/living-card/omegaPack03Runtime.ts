import { createVideoProfile, canShowVideoProfile } from "./videoProfile";
import { createLivingCard, addLivingCardAsset, enableLivingCardSharing, setLivingCardMode } from "./livingCardEngine";
import { composeLivingCard } from "./compositionEngine";
import { evolveLivingCard } from "./evolutionEngine";
import { createLivingCardSharePayload } from "./shareEngine";

export function runLumaSpaceOmegaMegaPack03Runtime() {
  const video = createVideoProfile({
    ownerId: "omega-citizen-003",
    durationSeconds: 12,
    consentGranted: true,
    hasCaptions: true,
    safeForDiscovery: true,
  });

  let card = createLivingCard({
    ownerId: "omega-citizen-003",
    title: "Waqar's Builder Space",
    openingVerse: "Building with quiet fire",
    tone: "builder",
    mode: "living_card",
  });

  card = addLivingCardAsset(card, {
    id: "asset_memory_001",
    kind: "memory",
    label: "First Light memory",
    weight: 80,
  });

  card = evolveLivingCard(card, "first_bridge");
  card = setLivingCardMode(card, "video");
  card = enableLivingCardSharing(card);

  const composition = composeLivingCard(card);
  const share = createLivingCardSharePayload(card);

  return {
    ok:
      canShowVideoProfile(video) &&
      card.shareable &&
      card.mode === "video" &&
      card.assets.length >= 2 &&
      composition.durationSeconds >= 5 &&
      share.safeToShare,
    video,
    card,
    composition,
    share,
  };
}
