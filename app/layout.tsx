import type { Metadata } from "next";
import GlobalPortalNav from "@/components/navigation/GlobalPortalNav";

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
    <html lang="en">
      <body style={{ margin: 0 }}>
        <GlobalPortalNav />
        {children}
      </body>
    </html>
  );
}
