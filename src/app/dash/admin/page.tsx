import { requireRole } from "@/lib/auth/requireRole";
import { getUser } from "@/lib/auth/session";
export default async function AdminDash(){
  await requireRole("admin");
  const u = await getUser();
  return (<div style={{padding:24}}>
    <h1>Admin Dashboard</h1>
    <p>Welcome, {u?.name} (role: {u?.role})</p>
  </div>);
}
