import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTHENTICATED_ROLES = new Set([
  "admin",
  "moderator",
  "creator",
  "advertiser",
  "user",
]);

export const dynamic = "force-dynamic";

export default async function CreatorPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value ?? "guest";

  if (!AUTHENTICATED_ROLES.has(role)) {
    redirect("/login?callbackUrl=/creator");
  }

  const creatorMode = cookieStore.get("isCreator")?.value === "1";

  return (
    <main style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
      {creatorMode ? (
        <>
          <h1>Lumora Creator Dashboard</h1>
          <p>Creator mode is active.</p>
          <nav style={{ display: "grid", gap: 12, marginTop: 20 }}>
            <a href="/creator/upload">Upload</a>
            <a href="/creator/live">Go Live</a>
            <a href="/creator/studio">Studio</a>
            <a href="/creator/analytics">Analytics</a>
            <a href="/creator/quests">Quests</a>
            <a href="/creator/rewards">Rewards</a>
          </nav>
          <form action="/api/creator/disable" method="post" style={{ marginTop: 24 }}>
            <button type="submit">Disable Creator Mode</button>
          </form>
        </>
      ) : (
        <>
          <h1>Become a Lumora Creator</h1>
          <p>Enable creator mode to access creator tools.</p>
          <form action="/api/creator/enable" method="post" style={{ marginTop: 24 }}>
            <button type="submit">Enable Creator Mode</button>
          </form>
        </>
      )}
    </main>
  );
}
