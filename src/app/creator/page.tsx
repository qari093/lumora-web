import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ALLOWED = new Set(["user","mod","admin"]);

export default function CreatorPage() {
  const c = cookies();
  const role = c.get("role")?.value;

  // Only treat user as logged-in if role is one of user/mod/admin
  if (!role || !ALLOWED.has(role)) {
    redirect("/login");
  }

  const isCreator = c.get("isCreator")?.value === "1";

  const btn: any = {
    display: "inline-block",
    padding: "10px 14px",
    border: "1px solid #333",
    borderRadius: 10,
    textDecoration: "none",
    background: "linear-gradient(180deg,#f8fafc,#e5e7eb)",
    color: "#111",
    fontWeight: 800,
    cursor: "pointer",
    textAlign: "center"
  };
  const btnDanger: any = { ...btn, background:"#111827", color:"#fff", borderColor:"#444" };

  return (
    <div style={{ padding: 20, maxWidth: 760, margin: "0 auto" }}>
      {isCreator ? (
        <>
          <h1 style={{ marginBottom: 10 }}>Creator Dashboard</h1>
          <p style={{ opacity: .8, marginBottom: 16 }}>Welcome! Quick actions:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 10 }}>
            <a href="/creator/upload" style={btn}>Upload</a>
            <a href="/creator/live" style={btn}>Go Live</a>
            <a href="/creator/studio" style={btn}>Studio</a>
            <a href="/creator/analytics" style={btn}>Analytics</a>
            <a href="/creator/quests" style={btn}>Quests</a>
            <a href="/creator/rewards" style={btn}>Rewards</a>
          </div>
          <form action="/api/creator/disable" method="post" style={{ marginTop: 20 }}>
            <button type="submit" style={btnDanger}>Disable Creator Mode</button>
          </form>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: 10 }}>Become a Creator</h1>
          <p style={{ opacity: .8, marginBottom: 16 }}>Enable creator mode to access Upload, Live, Studio, and Rewards.</p>
          <form action="/api/creator/enable" method="post">
            <button type="submit" style={btn}>Enable Creator Mode</button>
          </form>
        </>
      )}
    </div>
  );
}
