"use client";

import type { GeneratorFilters } from "@/types/generator";

export type QuickMode = "random" | "team" | "starter" | "monotype" | "no-legendaries" | "legendary";

const modes: Array<{ id: QuickMode; icon: string; label: string; note: string }> = [
  { id: "random", icon: "✦", label: "Completely Random", note: "One pick, every generation" },
  { id: "team", icon: "⌘", label: "Team of 6", note: "Six unique picks" },
  { id: "starter", icon: "♧", label: "Random Starter", note: "Main-series starters" },
  { id: "monotype", icon: "◒", label: "Monotype Team", note: "One shared type" },
  { id: "no-legendaries", icon: "◇", label: "No Legendaries", note: "Regular Pokémon only" },
  { id: "legendary", icon: "♛", label: "Legendary Only", note: "One legendary pick" },
];

export function QuickModes({
  active,
  onSelect,
}: {
  active: QuickMode | null;
  onSelect: (mode: QuickMode, next: (filters: GeneratorFilters) => GeneratorFilters) => void;
}) {
  const apply = (mode: QuickMode) => onSelect(mode, (filters) => {
    const base = {
      ...filters,
      starterOnly: false,
      legendaryOnly: false,
      categories: { paradox: "any", ultraBeast: "any", regionalForm: "any", mega: "any", gigantamax: "any" } as const,
    };
    if (mode === "random") return { ...base, count: 1, generations: [], types: [], includeLegendaries: true, includeMythicals: true, fullyEvolvedOnly: false, teamMode: "random" };
    if (mode === "team") return { ...base, count: 6, allowDuplicates: false, includeLegendaries: false, includeMythicals: false, generations: [] };
    if (mode === "starter") return { ...base, count: 1, starterOnly: true, includeLegendaries: false, includeMythicals: false, teamMode: "random" };
    if (mode === "monotype") return { ...base, count: 6, types: filters.types.length ? [filters.types[0]] : ["fire"], typeMatch: "any", allowDuplicates: false };
    if (mode === "no-legendaries") return { ...base, includeLegendaries: false, includeMythicals: false };
    return { ...base, count: 1, includeLegendaries: true, includeMythicals: false, legendaryOnly: true, teamMode: "random" };
  });
  return (
    <div className="quick-modes" aria-label="Quick generator modes">
      {modes.map((mode) => (
        <button key={mode.id} type="button" className={active === mode.id ? "quick-mode active" : "quick-mode"} onClick={() => apply(mode.id)} aria-pressed={active === mode.id}>
          <span className="quick-icon" aria-hidden="true">{mode.icon}</span>
          <span><strong>{mode.label}</strong><small>{mode.note}</small></span>
        </button>
      ))}
    </div>
  );
}
