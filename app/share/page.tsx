import ShareDemoClient from "./ShareDemoClient";

export const dynamic = "force-dynamic";

export default function SharePage() {
  return (
    <>
      {/* LUMORA_PORTAL_ALIVE_SHARE */}
      <ShareDemoClient />
    </>
  );
}
