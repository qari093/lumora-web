import { OWNER_ID } from "@/src/app/vendor/owner";

export const dynamic = "force-dynamic";

async function listCreatives() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/creatives/list?ownerId=${OWNER_ID}`, { cache: "no-store" });
  if (!res.ok) throw new Error("creatives fetch failed");
  return res.json();
}
async function createCreative(formData: FormData) {
  "use server";
  const payload = {
    ownerId: OWNER_ID,
    title: String(formData.get("title") || ""),
    image: String(formData.get("image") || ""),
    actionUrl: String(formData.get("actionUrl") || "")
  };
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/creatives/create`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), cache: "no-store"
  });
}

export default async function Page() {
  const data = await listCreatives();
  const rows = (data?.creatives ?? []) as any[];
  return (
    <main>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Creatives for {OWNER_ID}</h1>
      <form action={createCreative} style={{ display:"grid", gap:6, maxWidth: 520, marginBottom: 16 }}>
        <input name="title" placeholder="Title" required />
        <input name="image" placeholder="Image URL (/static/... or https://...)" required />
        <input name="actionUrl" placeholder="Action URL (https://...)" required />
        <button type="submit">Create</button>
      </form>
      <ul style={{ display:"grid", gap:10, paddingLeft: 0, listStyle:"none" }}>
        {rows.map(c => (
          <li key={c.id} style={{ display:"flex", gap:10, alignItems:"center" }}>
            <img alt="" src={`/api/creatives/thumb?url=${encodeURIComponent(c.image)}`} width="96" height="64" style={{ objectFit:"cover", border:"1px solid #eee" }} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600 }}>{c.title}</div>
              <div style={{ fontSize:12, color:"#555" }}>{c.image}</div>
            </div>
            <a href={c.actionUrl} target="_blank" rel="noreferrer">open</a>
          </li>
        ))}
        {rows.length === 0 && <li>No creatives yet.</li>}
      </ul>
    </main>
  );
}
