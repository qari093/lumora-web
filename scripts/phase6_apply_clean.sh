#!/usr/bin/env bash
set -e

# 1) requireRole helper
mkdir -p src/lib/auth
cat > src/lib/auth/requireRole.ts <<'EOF1'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RANK: Record<string, number> = { admin:5, moderator:4, creator:3, advertiser:2, user:1, guest:0 };

export async function requireRole(minRole: keyof typeof RANK, destination: string = "/auth/login") {
  const jar = await cookies();
  const role = jar.get("role")?.value || "guest";
  if ((RANK[role] ?? 0) >= (RANK[minRole] ?? 0)) return role;
  redirect(`${destination}?redirect=${encodeURIComponent("/")}`);
}
EOF1

# 2) Guarded dashboards (overwrite minimal pages)
mkdir -p "src/app/(dash)/admin" "src/app/(dash)/moderator" "src/app/(dash)/creator" "src/app/(dash)/advertiser" "src/app/(dash)/user"

cat > "src/app/(dash)/admin/page.tsx" <<'EOF2'
import { requireRole } from "@/lib/auth/requireRole";
import { getUser } from "@/lib/auth/session";

export default async function AdminDash(){
  await requireRole("admin");
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {u?.name} (role: {u?.role})</p>
    </div>
  );
}
EOF2

cat > "src/app/(dash)/moderator/page.tsx" <<'EOF3'
import { requireRole } from "@/lib/auth/requireRole";
import { getUser } from "@/lib/auth/session";

export default async function ModeratorDash(){
  await requireRole("moderator");
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>Moderator Dashboard</h1>
      <p>Welcome, {u?.name} (role: {u?.role})</p>
    </div>
  );
}
EOF3

cat > "src/app/(dash)/creator/page.tsx" <<'EOF4'
import { requireRole } from "@/lib/auth/requireRole";
import { getUser } from "@/lib/auth/session";

export default async function CreatorDash(){
  await requireRole("creator");
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>Creator Dashboard</h1>
      <p>Welcome, {u?.name} (role: {u?.role})</p>
    </div>
  );
}
EOF4

cat > "src/app/(dash)/advertiser/page.tsx" <<'EOF5'
import { requireRole } from "@/lib/auth/requireRole";
import { getUser } from "@/lib/auth/session";

export default async function AdvertiserDash(){
  await requireRole("advertiser");
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>Advertiser Dashboard</h1>
      <p>Welcome, {u?.name} (role: {u?.role})</p>
    </div>
  );
}
EOF5

cat > "src/app/(dash)/user/page.tsx" <<'EOF6'
import { requireRole } from "@/lib/auth/requireRole";
import { getUser } from "@/lib/auth/session";

export default async function UserDash(){
  await requireRole("user");
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>User Dashboard</h1>
      <p>Welcome, {u?.name} (role: {u?.role})</p>
    </div>
  );
}
EOF6

# 3) WhoAmI page
mkdir -p src/app/auth
cat > src/app/auth/whoami/page.tsx <<'EOF7'
import { getUser } from "@/lib/auth/session";
export default async function WhoAmI(){
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>Who am I</h1>
      <pre>{JSON.stringify(u, null, 2)}</pre>
    </div>
  );
}
EOF7

# 4) Commit + restart (no emojis, simple echo)
git add -A
git commit -m "Phase 6: apply server-side requireRole guards + whoami" >/dev/null 2>&1 || true
pkill -f "next dev" >/dev/null 2>&1 || true
: "${PORT:=3000}"
PORT="$PORT" npx next dev >/tmp/next-dev.out 2>&1 & disown
sleep 6
echo "Login   -> http://localhost:$PORT/auth/login"
echo "WhoAmI  -> http://localhost:$PORT/auth/whoami"
echo "Admin   -> http://localhost:$PORT/dash/admin"
echo "Creator -> http://localhost:$PORT/dash/creator"
echo "User    -> http://localhost:$PORT/dash/user"
