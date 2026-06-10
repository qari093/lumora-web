import FypAutoplayFeed from "./FypAutoplayFeed";
import {
  fullscreenSourceFeed,
  getFullscreenSourceFeedSummary
} from "@/src/core/fyp/fullscreenSourceFeed";

export default function FypPage() {
  const summary = getFullscreenSourceFeedSummary();

  return (
    <FypAutoplayFeed
      videos={fullscreenSourceFeed}
      itemCount={summary.itemCount}
    />
  );
}
