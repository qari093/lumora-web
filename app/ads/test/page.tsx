import AdWidget from "../../../src/components/AdWidget";

export default function TestPage() {
  return (
    <div style={{padding:"16px"}}>
      <h1>Ad Testbed</h1>
      <p style={{color:"#64748b"}}>Live preview below. Uses /api/ads/serve + /api/ads/track.</p>
      <AdWidget ownerId="OWNER_A" />
    </div>
  );
}
