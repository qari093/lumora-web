"use client";

import { useEffect } from "react";

export default function FypShellCleaner() {
  useEffect(() => {
    const hideSelectors = [
      'nav[aria-label="Global portal navigation"]',
      'nav[aria-label="Lumora portal arc"]',
      'button[data-testid="lumora-home-beacon"]',
      'div[data-testid="home-beacon-dashboard"]'
    ];

    const hidden: HTMLElement[] = [];

    for (const selector of hideSelectors) {
      document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
        node.dataset.fypHiddenByTraceCurrent = "true";
        node.style.setProperty("display", "none", "important");
        hidden.push(node);
      });
    }

    document.body.style.background = "#000";
    document.body.style.overflow = "hidden";

    return () => {
      hidden.forEach((node) => {
        node.style.removeProperty("display");
        delete node.dataset.fypHiddenByTraceCurrent;
      });
      document.body.style.removeProperty("background");
      document.body.style.removeProperty("overflow");
    };
  }, []);

  return null;
}
