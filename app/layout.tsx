import LumoraChromeGate from "@/components/layout/LumoraChromeGate";
import "./globals.css";
import "@/styles/system/lumora-visual-system.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lumora",
  description: "Lumora launch shell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body style={{ margin: 0 }} className="bg-[#050816] text-white min-h-screen overflow-x-hidden">
        <LumoraChromeGate />
        {children}
        
      </body>
    </html>
  );
}
