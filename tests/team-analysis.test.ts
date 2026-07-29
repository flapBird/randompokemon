import { describe, expect, it } from "vitest";
import { analyzeTeam } from "../src/lib/team-analysis";
import { generated, pokemon } from "./fixtures";

describe("team analysis", () => {
  it("counts shared weaknesses", () => {
    const team = [
      generated(pokemon(1, "One", ["grass", "flying"])),
      generated(pokemon(2, "Two", ["ground", "flying"])),
      generated(pokemon(3, "Three", ["dragon", "flying"])),
    ];
    const ice = analyzeTeam(team).weaknesses.find((item) => item.type === "ice");
    expect(ice?.count).toBe(3);
  });
  it("calculates average BST", () => {
    const team = [
      generated(pokemon(1, "One", ["fire"], { bst: 300 })),
      generated(pokemon(2, "Two", ["water"], { bst: 500 })),
      generated(pokemon(3, "Three", ["grass"], { bst: 400 })),
    ];
    expect(analyzeTeam(team).averageBst).toBe(400);
  });
});
