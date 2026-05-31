export type FirstOrbitTask =
  | "view_space_core"
  | "open_living_card"
  | "send_first_light"
  | "create_first_memory"
  | "open_first_bridge_gate";

export type FirstOrbitJourney = {
  citizenId: string;
  tasks: Record<FirstOrbitTask, boolean>;
  progressPercent: number;
};

const TASKS: FirstOrbitTask[] = [
  "view_space_core",
  "open_living_card",
  "send_first_light",
  "create_first_memory",
  "open_first_bridge_gate",
];

export function createFirstOrbitJourney(citizenId: string): FirstOrbitJourney {
  if (!citizenId.trim()) throw new Error("citizenId_required");

  return {
    citizenId,
    tasks: {
      view_space_core: false,
      open_living_card: false,
      send_first_light: false,
      create_first_memory: false,
      open_first_bridge_gate: false,
    },
    progressPercent: 0,
  };
}

export function completeOrbitTask(journey: FirstOrbitJourney, task: FirstOrbitTask): FirstOrbitJourney {
  const tasks = { ...journey.tasks, [task]: true };
  const completed = TASKS.filter((name) => tasks[name]).length;

  return {
    ...journey,
    tasks,
    progressPercent: Math.round((completed / TASKS.length) * 100),
  };
}
