import LivingUniverseRuntime from "@/src/components/lumaspace/runtime/LivingUniverseRuntime";
import LumaSpaceInteractionPanel from "@/components/lumaspace/interactions/LumaSpaceInteractionPanel";

export const dynamic = "force-dynamic";

export default function LumaSpacePage() {
  return (
    <>
      <LivingUniverseRuntime />
      <LumaSpaceInteractionPanel />
    </>
  );
}
