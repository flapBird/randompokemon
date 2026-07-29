"use client";

import { useState } from "react";
import type { GeneratedPokemon } from "@/types/generator";
import { TypeBadge } from "./TypeBadge";
import { PokemonDetails } from "./PokemonDetails";

export function PokemonCard({
  result,
  index,
  onLock,
  onReroll,
  onShiny,
  onRemove,
}: {
  result: GeneratedPokemon;
  index: number;
  onLock: () => void;
  onReroll: () => void;
  onShiny: () => void;
  onRemove: () => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { pokemon } = result;
  const image = result.shiny ? pokemon.shinySprite : pokemon.sprite;
  return (
    <article className="pokemon-card result-enter" data-locked={result.locked} style={{ "--card-accent": `var(--type-${pokemon.primaryType})` } as React.CSSProperties}>
      <div className="card-topline">
        <span className="slot-label">Slot {index + 1}</span>
        <span className="dex-number">#{String(pokemon.id).padStart(4, "0")}</span>
      </div>
      <div className="pokemon-art">
        <div className="art-orbit" aria-hidden="true" />
        {imageError ? (
          <div className="image-fallback" role="img" aria-label={`${pokemon.name} image unavailable`}>
            <span aria-hidden="true">?</span>
            <small>Image unavailable</small>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={`${result.shiny ? "Shiny " : ""}${pokemon.name}`} width="220" height="220" loading={index < 3 ? "eager" : "lazy"} onError={() => setImageError(true)} />
        )}
        {result.locked && <span className="lock-flag">Locked</span>}
        {result.shiny && <span className="shiny-flag">✦ Shiny</span>}
      </div>
      <div className="card-copy">
        <h3>{pokemon.name}</h3>
        <div className="type-row">{pokemon.types.map((type) => <TypeBadge type={type} key={type} />)}</div>
        <div className="pokemon-facts">
          <span>Gen {pokemon.generation} · {pokemon.region}</span>
          <span>BST <strong>{pokemon.bst}</strong></span>
        </div>
        <div className="random-build">
          <div><small>ABILITY</small><strong>{result.ability}</strong></div>
          <div><small>NATURE</small><strong>{result.nature}</strong></div>
        </div>
        <div className="status-tags">
          {pokemon.isLegendary && <span>Legendary</span>}
          {pokemon.isMythical && <span>Mythical</span>}
          {pokemon.isParadox && <span>Paradox</span>}
          {pokemon.isUltraBeast && <span>Ultra Beast</span>}
          {pokemon.isRegionalForm && <span>Regional</span>}
        </div>
      </div>
      <div className="card-actions">
        <button onClick={onLock} className={result.locked ? "active" : ""} aria-label={`${result.locked ? "Unlock" : "Lock"} ${pokemon.name}`} title={`${result.locked ? "Unlock" : "Lock"} this Pokémon`}>
          <span aria-hidden="true">{result.locked ? "●" : "○"}</span>{result.locked ? "Unlock" : "Lock"}
        </button>
        <button onClick={onReroll} disabled={result.locked} aria-label={`Reroll ${pokemon.name}`} title={result.locked ? "Unlock before rerolling" : "Reroll this slot"}><span aria-hidden="true">↻</span>Reroll</button>
        <button onClick={onShiny} aria-label={`Show ${result.shiny ? "normal" : "shiny"} ${pokemon.name}`} title="Toggle normal or shiny artwork"><span aria-hidden="true">✦</span>{result.shiny ? "Normal" : "Shiny"}</button>
        <button onClick={onRemove} aria-label={`Remove ${pokemon.name}`} title="Remove this Pokémon"><span aria-hidden="true">−</span>Remove</button>
        <button onClick={() => setDetailsOpen(true)} aria-label={`View details for ${pokemon.name}`} title="View base stats and details"><span aria-hidden="true">i</span>Details</button>
      </div>
      <PokemonDetails result={result} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </article>
  );
}
