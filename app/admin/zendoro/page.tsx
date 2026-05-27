import { getZendoroAdminRuntime } from "@/src/lib/zendoro/admin/adminRuntime";

export default function ZendoroAdminPage() {
  const runtime = getZendoroAdminRuntime();

  return (
    <main>
      <h1>Zendoro Admin</h1>
      <p>{runtime.uptime}</p>
    </main>
  );
}
