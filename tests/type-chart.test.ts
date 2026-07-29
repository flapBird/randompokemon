import { describe, expect, it } from "vitest";
import { calculateDefensiveMultiplier } from "../src/data/type-chart";

describe("calculateDefensiveMultiplier", () => {
  it("handles a single-type weakness", () => {
    expect(calculateDefensiveMultiplier(["grass"], "fire")).toBe(2);
  });
  it("handles a dual-type 4× weakness", () => {
    expect(calculateDefensiveMultiplier(["grass", "flying"], "ice")).toBe(4);
  });
  it("handles a dual-type cancellation", () => {
    expect(calculateDefensiveMultiplier(["water", "ground"], "fire")).toBe(0.5);
  });
  it("handles immunity", () => {
    expect(calculateDefensiveMultiplier(["flying"], "ground")).toBe(0);
  });
});
