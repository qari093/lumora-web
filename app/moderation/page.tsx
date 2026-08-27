import ModerationQueue from "@/components/moderation/ModerationQueue";
import AppealPanel from "@/components/moderation/AppealPanel";

export default function ModerationPage() {
  return (
    <main>
      <h1>Moderation</h1>
      <ModerationQueue />
      <AppealPanel />
    </main>
  );
}
