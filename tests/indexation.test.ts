import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { metadata as homepageMetadata } from "../app/page";
import { generateMetadata as pokemonMetadata } from "../app/pokemon/[slug]/page";
import { proxy } from "../proxy";

describe("indexation and canonical rules", () => {
  it("keeps the homepage canonical stable", () => {
    expect(homepageMetadata.alternates?.canonical).toBe("/");
  });

  it("uses a self-canonical for Pokémon detail pages", async () => {
    const metadata = await pokemonMetadata({ params: Promise.resolve({ slug: "pikachu" }) });

    expect(metadata.alternates?.canonical).toBe("/pokemon/pikachu");
  });

  it("adds noindex, follow to parameterized HTML responses site-wide", () => {
    const homepageState = proxy(new NextRequest("https://randompokemon.xyz/?seed=TEST&type=fire"));
    const plannerState = proxy(new NextRequest("https://randompokemon.xyz/team-planner?pokemon=pikachu"));
    const cleanPage = proxy(new NextRequest("https://randompokemon.xyz/pokemon/pikachu"));

    expect(homepageState.headers.get("X-Robots-Tag")).toBe("noindex, follow");
    expect(plannerState.headers.get("X-Robots-Tag")).toBe("noindex, follow");
    expect(cleanPage.headers.get("X-Robots-Tag")).toBeNull();
  });
});
