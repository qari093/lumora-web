import AppChrome from "@/components/core/AppChrome";

export const metadata = { title: "Lumora", description: "Lumora App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* lightweight client analytics helper (non-blocking) */}
        <script src="/gmar-analytics.js" defer></script>
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        {/* Global chrome: PRO badge, footer links, page-view tracking */}
        <AppChrome />
        {children}
      </body>
    </html>
  );
}