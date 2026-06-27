import FypAutoplayFeed from "./FypAutoplayFeed";
import { applyTraceAwareFeedRerank } from "@/src/core/fyp/runtime-learning/traceAwareRerank";

export const dynamic = "force-dynamic";

export default function FypPage() {
  const runtime = applyTraceAwareFeedRerank();

  const items = runtime.cards
    .filter((card) => card.lane === "native_video" && card.autoplayEligible && card.playbackUrl)
    .map((card) => ({
      id: card.id,
      sourceName: card.sourceId,
      handle: `@${card.creator.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18) || "lumora"}`,
      policy: "owned or licensed" as const,
      title: card.title,
      lane: "space" as const,
      videoUrl: card.playbackUrl,
      posterUrl: "",
      likes: `${Math.max(1, Math.round(card.rankScore * 100))}K`,
      comments: "Trace",
      saves: "Save",
      shares: "Share"
    }));

  return <FypAutoplayFeed items={items} />;
}
