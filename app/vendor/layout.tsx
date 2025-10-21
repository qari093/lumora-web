export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system", margin: 20 }}>
        <div style={{ display:"flex", gap:12, marginBottom:16 }}>
          <a href="/vendor">Home</a>
          <a href="/vendor/campaigns">Campaigns</a>
          <a href="/vendor/creatives">Creatives</a>
          <a href="/vendor/metrics">Metrics</a>
        </div>
        {children}
      </body>
    </html>
  );
}
