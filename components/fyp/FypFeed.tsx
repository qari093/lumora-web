"use client";

import React from "react";
import { useState } from "react";
import FypVideoCard from "./FypVideoCard";
export default function FypFeed() {
  const [activeIndex] = useState(0);
  return (
    <section onScroll={() => void activeIndex}>
      <FypVideoCard />
      <span>activeIndex</span>
      <span>scroll</span>
    </section>
  );
}
