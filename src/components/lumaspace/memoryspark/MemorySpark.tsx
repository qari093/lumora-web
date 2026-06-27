"use client";

import { createMemorySpark } from "@/src/core/lumaspace/memoryspark/runtime";
import YearRecap from "./YearRecap";

export default function MemorySpark() {
  return (
    <section data-testid="lumaspace-memory-spark">
      <YearRecap spark={createMemorySpark(2026)} />
    </section>
  );
}
