import "./globals.css";
export const metadata = { title: "Lumora", description: "App Router baseline" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
