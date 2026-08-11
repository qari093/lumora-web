import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { authOptions } from '@/src/core/auth/authOptions';

export const dynamic = 'force-dynamic';

export default async function CreatorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/creator');
  }

  const cookieStore = await cookies();

  const creatorMode =
    session.user.role === 'creator' ||
    session.user.role === 'admin' ||
    cookieStore.get('isCreator')?.value === '1';

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 760,
        margin: '0 auto',
      }}
    >
      <p style={{ opacity: 0.7 }}>
        Signed in as {session.user.email} — {session.user.role}
      </p>

      {creatorMode ? (
        <>
          <h1>Lumora Creator Dashboard</h1>

          <p>Creator mode is active.</p>

          <nav
            style={{
              display: 'grid',
              gap: 12,
              marginTop: 20,
            }}
          >
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
