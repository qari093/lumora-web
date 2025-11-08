"use client";
import { useEffect, useRef } from "react";

/** Close rules:
 *  • Esc key
 *  • Backdrop tap (outside .glass-sheet but inside .lumora-overlay)
 *  • Swipe-up on the glass sheet (drag up > 64px or quick flick)
 * Dispatches →  lumora:overlay-close
 */
export default function OverlayCloseGestures() {
  const openRef = useRef(false);
  const drag = useRef<{ y0:number; y:number; active:boolean; time:number }>({ y0:0, y:0, active:false, time:0 });

  useEffect(() => {
    const onOpen = () => { openRef.current = true; };
    const onClose = () => { openRef.current = false; };
    addEventListener("lumora:overlay-open", onOpen as EventListener);
    addEventListener("lumora:overlay-close", onClose as EventListener);

    const close = () => {
      if (!openRef.current) return;
      try { (window as any).Haptics?.pulse?.(); } catch {}
      dispatchEvent(new CustomEvent("lumora:overlay-close"));
    };

    // Esc → close
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); close(); } };

    // Backdrop tap OR start swipe on sheet
    const onPointerDown = (e: PointerEvent) => {
      if (!openRef.current) return;
      const t = e.target as Element | null; if (!t) return;
      const overlay = t.closest(".lumora-overlay") as HTMLElement | null;
      if (!overlay) return;
      const onSheet = !!t.closest(".glass-sheet");
      if (onSheet) {
        drag.current = { y0: e.clientY, y: e.clientY, active: true, time: performance.now() };
        overlay.setPointerCapture?.(e.pointerId);
      } else {
        close();
      }
    };

    // Follow finger while dragging up
    const onPointerMove = (e: PointerEvent) => {
      if (!openRef.current || !drag.current.active) return;
      drag.current.y = e.clientY;
      const overlay = document.querySelector(".lumora-overlay") as HTMLElement | null;
      const sheet = overlay?.querySelector(".glass-sheet") as HTMLElement | null;
      if (!sheet) return;
      const dy = Math.min(0, drag.current.y - drag.current.y0);   // negative when up
      const follow = Math.max(-80, dy);
      sheet.style.transition = "transform 0s, opacity 0s";
      sheet.style.transform  = `translateY(${follow}px)`;
      sheet.style.opacity    = `${1 + follow/120}`;
    };

    // Release → decide close or snap back
    const onPointerUp = () => {
      if (!openRef.current || !drag.current.active) return;
      const elapsed = Math.max(1, performance.now() - drag.current.time);
      const dy = drag.current.y - drag.current.y0;   // negative if up
      const velocity = -dy / elapsed;                // px/ms upwards
      drag.current.active = false;

      const overlay = document.querySelector(".lumora-overlay") as HTMLElement | null;
      const sheet = overlay?.querySelector(".glass-sheet") as HTMLElement | null;

      const shouldClose = (dy < -64) || (velocity > 0.7);
      if (shouldClose) {
        sheet && (sheet.style.transition = "");
        try { (window as any).Haptics?.pulse?.(); } catch {}
        dispatchEvent(new CustomEvent("lumora:overlay-close"));
      } else if (sheet) {
        sheet.style.transition = "transform 160ms ease, opacity 160ms ease";
        sheet.style.transform  = "translateY(0)";
        sheet.style.opacity    = "1";
        setTimeout(() => { sheet.style.transition = ""; }, 200);
      }
    };

    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onPointerDown);
    addEventListener("pointermove", onPointerMove);
    addEventListener("pointerup", onPointerUp);
    addEventListener("pointercancel", onPointerUp);

    return () => {
      removeEventListener("lumora:overlay-open", onOpen as EventListener);
      removeEventListener("lumora:overlay-close", onClose as EventListener);
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onPointerDown);
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("pointerup", onPointerUp);
      removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return null;
}
