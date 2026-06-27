"use client";

import { useEffect } from "react";

const HIDE_SELECTORS = [
  'nav[aria-label="Global portal navigation"]',
  'nav[aria-label="Lumora portal arc"]',
  'button[data-testid="lumora-home-beacon"]',
  'div[data-testid="home-beacon-dashboard"]',
  '[data-home-beacon-state]',
  '[data-home-beacon-portal]',
  '[data-testid="home-beacon-portal-arc"]'
];

export default function FypShellCleaner() {
  useEffect(() => {
    document.documentElement.classList.add("lumora-fyp-isolated");
    document.body.classList.add("lumora-fyp-isolated");

    const hide = () => {
      for (const selector of HIDE_SELECTORS) {
        document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
          node.style.display = "none";
          node.style.visibility = "hidden";
          node.style.opacity = "0";
          node.style.pointerEvents = "none";
          node.setAttribute("aria-hidden", "true");
        });
      }
    };

    hide();

    const observer = new MutationObserver(hide);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("lumora-fyp-isolated");
      document.body.classList.remove("lumora-fyp-isolated");
    };
  }, []);

  return null;
}
