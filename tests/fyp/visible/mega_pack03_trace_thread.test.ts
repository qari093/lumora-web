import { describe,it,expect } from "vitest";
import fs from "node:fs";

describe("Mega Pack 03 Trace Thread",()=> {
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx","utf8");
  const thread = fs.readFileSync("components/fyp/TraceThread.tsx","utf8");
  const thumb = fs.readFileSync("components/fyp/TraceThumbnail.tsx","utf8");

  it("wires TraceThread into FYP player",()=> {
    expect(player).toContain("TraceThread");
    expect(player).toContain("useTraceThread");
    expect(player).toContain("open={traceThread.open}");
  });

  it("Genesis chip opens the trace thread",()=> {
    expect(player).toContain("onClick={traceThread.openThread}");
    expect(player).toContain("Genesis Collection");
  });

  it("thread has filmstrip behavior",()=> {
    expect(thread).toContain("overflow-x-auto");
    expect(thread).toContain("onSelect(index)");
    expect(thread).toContain("onClose()");
  });

  it("thumbnail highlights active trace",()=> {
    expect(thumb).toContain("active");
    expect(thumb).toContain("border-cyan-300");
  });
});
