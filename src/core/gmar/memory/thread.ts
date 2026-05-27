import { createFirstLightEcho } from "./firstLight";

export type MemoryThreadItem = {
  id: string;
  title: string;
  kind: "first_light" | "echo" | "gap";
};

export function createInitialMemoryThread(): MemoryThreadItem[] {
  const first = createFirstLightEcho();

  return [
    {
      id: first.id,
      title: first.title,
      kind: "first_light",
    },
  ];
}

export function memoryThreadHasFirstLight(thread = createInitialMemoryThread()): boolean {
  return thread.some((item) => item.id === "first-light" && item.kind === "first_light");
}
