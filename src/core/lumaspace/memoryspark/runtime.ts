export type MemorySpark = {
  year: number;
  title: string;
  scenes: string[];
  output: "mp4";
};

export function createMemorySpark(year = new Date().getFullYear()): MemorySpark {
  return {
    year,
    title: `${year} Memory Spark`,
    scenes: ["Homecoming", "Story Constellation", "Echoes", "People", "Worlds"],
    output: "mp4"
  };
}

export function getMemorySparkDurationSeconds(sceneCount: number): number {
  return Math.max(45, Math.min(120, sceneCount * 18));
}
