import FypOmegaPlayer from "./FypOmegaPlayer";
import { getProductionFypFeed } from "@/src/core/fyp/feed/productionFeedAdapter";

export const dynamic = "force-dynamic";

export default function FypPage() {
  const feed = getProductionFypFeed();

  return (
    <>
      {/* LUMORA_PORTAL_ALIVE_FYP */}
      <FypOmegaPlayer
        initialFeed={feed.ok ? feed.feed : []}
        source={feed.source}
      />
    </>
  );
}
