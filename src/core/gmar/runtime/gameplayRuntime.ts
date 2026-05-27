export type GameplayTick = {
  frame: number;
  delta: number;
  ts: number;
};

export class GameplayRuntime {
  private running = false;
  private frame = 0;

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  status() {
    return {
      running: this.running,
      frame: this.frame
    };
  }

  tick(delta: number): GameplayTick {
    this.frame += 1;

    return {
      frame: this.frame,
      delta,
      ts: Date.now()
    };
  }
}
