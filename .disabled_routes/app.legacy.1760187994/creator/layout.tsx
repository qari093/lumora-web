import type { ReactNode } from "react";
import { BG } from "@/app/ui/_lux/theme";

export default function Layout({ children }: { children: ReactNode }) {
  const css =
    ".hover-lift{transition:transform .16s ease, box-shadow .16s ease;}" +
    ".hover-lift:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.35);}";

  return (
    <div style={{ minHeight:"100dvh", background: BG, padding: 16 }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </div>
  );
}
