import { deriveModeLabel } from "../app/_components/lumaspace/state-banner";

describe("deriveModeLabel", () => {
  it("returns a descriptive label for demo mode", () => {
    expect(deriveModeLabel("demo")).toMatch(/Demo/i);
  });

  it("returns a descriptive label for beta mode", () => {
    expect(deriveModeLabel("beta")).toMatch(/Beta/i);
  });

  it("returns a descriptive label for live mode", () => {
    expect(deriveModeLabel("live")).toMatch(/Live/i);
  });
});
