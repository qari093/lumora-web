import { requireRole } from "@/lib/auth/requireRole";
import { getUser } from "@/lib/auth/session";
export default async function CreatorDash(){
  await requireRole("creator");
  const u = await getUser();
  return (<div style={{padding:24}}>
    <h1>Creator Dashboard</h1>
    <p>Welcome, {u?.name} (role: {u?.role})</p>
  </div>);
}
