import FypAutoplayFeed from "./FypAutoplayFeed";
import { fypYoutubeVideos, getFypYoutubeFeedSummary } from "@/src/core/fyp/youtubeFeed";

export default function FypPage() {
  const summary = getFypYoutubeFeedSummary();

  return (
    <FypAutoplayFeed
      videos={fypYoutubeVideos}
      itemCount={summary.itemCount}
    />
  );
}
