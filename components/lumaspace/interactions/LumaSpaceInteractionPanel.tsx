import { getLumaSpaceInteractionArchive } from "@/src/core/interactions";

export default function LumaSpaceInteractionPanel() {
  const archive = getLumaSpaceInteractionArchive();

  return (
    <section data-testid="lumaspace-interaction-panel">
      <h2>Lumora Interactions</h2>
      {archive.resonanceHistory && <div>Resonance Archive</div>}
      {archive.reflectionJournal && <div>Reflection Journal</div>}
      {archive.rippleActivity && <div>Ripple History</div>}
      {archive.echoStream && <div>Echo Stream</div>}
      {archive.growthCompass && <div>Growth Compass</div>}
    </section>
  );
}
