import type { PokemonType } from "@/types/pokemon";
import { title } from "@/lib/team-analysis";

export function TypeBadge({ type, count }: { type: PokemonType; count?: number }) {
  return (
    <span className="type-badge" data-type={type}>
      <span className="type-dot" aria-hidden="true" />
      {title(type)}{count ? ` ×${count}` : ""}
    </span>
  );
}
