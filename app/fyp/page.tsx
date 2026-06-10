import FypAutoplayFeed from "./FypAutoplayFeed";
import { fypFullscreenSources } from "@/src/core/fyp/fullscreenSourceFeed";

export default function FypPage() {
  return <FypAutoplayFeed items={fypFullscreenSources} />;
}
