import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Lumexa",
  description: "Lumexa portal",
};

export const viewport: Viewport = {
};

export default function LumexaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
