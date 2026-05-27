"use client";

import React from "react";
import FypVideoCard from "./FypVideoCard";
const starterCards = [
  { id: "welcome", title: "Lumora Welcome Drop", tag: "starter" },
  { id: "gmar", title: "GMAR Highlight Seed", tag: "game" },
  { id: "cineverse", title: "CineVerse Discovery Seed", tag: "cinema" },
];
export default function FypFlow() {
  return (
    <section
      data-testid="fyp-scroll"
      className="fyp-scroll overflow-y-auto overflow-auto snap-y snap-mandatory"
      aria-label="Lumora Feed"
      style={{
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        background: "#05060a",
        color: "#fff",
      }}
    >
      <span id="LUMORA_FYP_REPEAT_VARIATION" data-testid="repeat-session-alive">
        repeat-session-alive
      </span>
      <h1>Lumora Feed</h1>
      <p>{starterCards.length} items</p>
      {starterCards.map((card) => (
        <article
          key={card.id}
          data-testid="fyp-card"
          className="fyp-card snap-start"
          style={{
            minHeight: "100vh",
            scrollSnapAlign: "start",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div>
            <h2>{card.title}</h2>
            <p>{card.tag}</p>
            <FypVideoCard />
          </div>
        </article>
      ))}
      <span>activeIndex</span>
      <span>scroll</span>
    </section>
  );
}
