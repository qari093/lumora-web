"use client";

import { useEffect } from "react";

const FYP_BODY_CLASS = "lumora-fyp-active";

export default function FypShellCleaner() {
  useEffect(() => {
    const hideSelectors = [
      'nav[aria-label="Global portal navigation"]',
      'nav[aria-label="Lumora portal arc"]',
      'button[data-testid="lumora-home-beacon"]',
      'div[data-testid="home-beacon-dashboard"]'
    ];

    const hidden: HTMLElement[] = [];

    document.body.classList.add(FYP_BODY_CLASS);
    document.body.style.setProperty("background", "#000", "important");
    document.body.style.setProperty("overflow", "hidden", "important");

    for (const selector of hideSelectors) {
      document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
        node.dataset.fypHiddenByTraceCurrent = "true";
        node.style.setProperty("display", "none", "important");
        hidden.push(node);
      });
    }

    return () => {
      hidden.forEach((node) => {
        node.style.removeProperty("display");
        delete node.dataset.fypHiddenByTraceCurrent;
      });

      document.body.classList.remove(FYP_BODY_CLASS);
      document.body.style.removeProperty("background");
      document.body.style.removeProperty("overflow");
    };
  }, []);

  return null;
}
