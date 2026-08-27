import CreatorDashboardClient from "@/components/creator-dashboard/CreatorDashboardClient";
import CreatorProfileCard from "@/components/creator/CreatorProfileCard";

export default function CreatorDashboardPage() {
  return (
    <main>
      <CreatorDashboardClient />
      <section aria-label="Creator profile">
        <CreatorProfileCard />
      </section>
    </main>
  );
}
