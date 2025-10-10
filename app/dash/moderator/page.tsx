import { getUser } from "@/lib/auth/session";
export default async function Page(){
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>moderator Dashboard</h1>
      <p>Welcome, {u?.name} (role: {u?.role})</p>
    </div>
  );
}
