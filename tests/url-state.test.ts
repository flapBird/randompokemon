import { afterEach, describe, expect, it, vi } from "vitest";
import { STANDARD_FILTERS } from "../src/lib/defaults";
import { createShareUrl, readUrlState } from "../src/lib/url-state";
import { generated, pokemon } from "./fixtures";

describe("URL state", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("preserves the homepage Smart Team default when mode is absent", () => {
    expect(readUrlState("", STANDARD_FILTERS).filters.teamMode).toBe("smart");
  });

  it("honors an explicit Pure Random mode", () => {
    expect(readUrlState("?mode=random", STANDARD_FILTERS).filters.teamMode).toBe("random");
  });

  it("round-trips the complete generated snapshot", () => {
    vi.stubGlobal("window", { location: { origin: "https://randompokemon.xyz", pathname: "/" } });
    const first = { ...generated(pokemon(25, "Pikachu", ["electric"]), true), ability: "Static", nature: "Jolly", shiny: true };
    const second = { ...generated(pokemon(133, "Eevee", ["normal"])), ability: "Adaptability", nature: "Calm" };
    const url = createShareUrl("KANTO-12345", { ...STANDARD_FILTERS, count: 2, teamMode: "random" }, [first, second]);
    const parsed = readUrlState(new URL(url).search, STANDARD_FILTERS);
    expect(parsed.filters.teamMode).toBe("random");
    expect(parsed.members).toEqual([
      { slug: "pikachu", ability: "Static", nature: "Jolly", shiny: true, locked: true },
      { slug: "eevee", ability: "Adaptability", nature: "Calm", shiny: false, locked: false },
    ]);
  });
});
