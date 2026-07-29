"use client";

import type { GeneratedPokemon } from "@/types/generator";
import { title } from "@/lib/team-analysis";
import { Modal } from "../ui/Modal";
import { TypeBadge } from "./TypeBadge";

const statLabels = [
  ["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"],
  ["specialAttack", "Sp. Attack"], ["specialDefense", "Sp. Defense"], ["speed", "Speed"],
] as const;

export function PokemonDetails({ result, open, onClose }: { result: GeneratedPokemon; open: boolean; onClose: () => void }) {
  const { pokemon } = result;
  return (
    <Modal open={open} onClose={onClose} title={`${pokemon.name} details`}>
      <div className="details-layout">
        <div className="details-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.shiny ? pokemon.shinySprite : pokemon.sprite} alt={`${result.shiny ? "Shiny " : ""}${pokemon.name}`} width="240" height="240" />
          <span className="dex-number">#{String(pokemon.id).padStart(4, "0")}</span>
        </div>
        <div>
          <div className="type-row">{pokemon.types.map((type) => <TypeBadge type={type} key={type} />)}</div>
          <dl className="detail-list">
            <div><dt>Species</dt><dd>{pokemon.category}</dd></div>
            <div><dt>Generation</dt><dd>Generation {pokemon.generation}</dd></div>
            <div><dt>Region</dt><dd>{pokemon.region}</dd></div>
            <div><dt>Height</dt><dd>{pokemon.height.toFixed(1)} m</dd></div>
            <div><dt>Weight</dt><dd>{pokemon.weight.toFixed(1)} kg</dd></div>
            <div><dt>Abilities</dt><dd>{pokemon.abilities.join(", ")}</dd></div>
          </dl>
          <div className="status-tags">
            {pokemon.isLegendary && <span>Legendary</span>}
            {pokemon.isMythical && <span>Mythical</span>}
            {pokemon.isParadox && <span>Paradox</span>}
            {pokemon.isUltraBeast && <span>Ultra Beast</span>}
            {pokemon.isRegionalForm && <span>Regional Form</span>}
            {pokemon.isMega && <span>Mega Evolution</span>}
            {pokemon.isGigantamax && <span>Gigantamax</span>}
          </div>
        </div>
      </div>
      <div className="stats-list" aria-label={`${pokemon.name} base stats`}>
        {statLabels.map(([key, label]) => (
          <div className="stat-row" key={key}>
            <span>{label}</span><strong>{pokemon.stats[key]}</strong>
            <span className="stat-track"><span style={{ width: `${Math.min(100, pokemon.stats[key] / 1.8)}%` }} /></span>
          </div>
        ))}
        <div className="stat-total"><span>Base Stat Total</span><strong>{pokemon.bst}</strong></div>
      </div>
      <p className="detail-footnote">Random assignment: {title(result.nature)} nature · {result.ability} ability</p>
    </Modal>
  );
}
