import { analyzeTeam, title } from "@/lib/team-analysis";
import type { GeneratedPokemon } from "@/types/generator";
import type { PokemonType } from "@/types/pokemon";
import { TypeBadge } from "../pokemon/TypeBadge";

export function TeamAnalysis({
  team,
  selectedWeakness,
  onSelectWeakness,
  onRerollWeakness,
}: {
  team: GeneratedPokemon[];
  selectedWeakness: PokemonType | null;
  onSelectWeakness: (type: PokemonType | null) => void;
  onRerollWeakness: (type: PokemonType) => void;
}) {
  const analysis = analyzeTeam(team);
  return (
    <section className="team-analysis" aria-labelledby="team-analysis-heading">
      <div className="section-kicker">AT A GLANCE</div>
      <h2 id="team-analysis-heading">Team Analysis</h2>
      <p>Quick defensive patterns and composition stats for this roll.</p>
      <div className="analysis-summary">
        {[
          ["Pokémon", analysis.total],
          ["Unique types", analysis.uniqueTypes],
          ["Average BST", analysis.averageBst],
          ["Highest BST", analysis.highestBst],
          ["Lowest BST", analysis.lowestBst],
          ["Legendaries", analysis.legendaryCount],
        ].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </div>
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>Type distribution</h3>
          <div className="type-cloud">{analysis.typeDistribution.map((item) => <TypeBadge key={item.type} type={item.type} count={item.count} />)}</div>
        </div>
        <div className="analysis-card">
          <h3>Shared weaknesses</h3>
          {analysis.weaknesses.length ? <ul>{analysis.weaknesses.map((item) => <li key={item.type}><button type="button" className={selectedWeakness === item.type ? "analysis-link selected" : "analysis-link"} aria-pressed={selectedWeakness === item.type} onClick={() => onSelectWeakness(selectedWeakness === item.type ? null : item.type)}><span>{title(item.type)}</span><strong>{item.count} weak</strong></button></li>)}</ul> : <p>No major shared weaknesses.</p>}
        </div>
        <div className="analysis-card">
          <h3>Team resistances</h3>
          {analysis.resistances.length ? <ul>{analysis.resistances.map((item) => <li key={item.type}><span>{title(item.type)}</span><strong>{item.count} resist</strong></li>)}</ul> : <p>No repeated resistances yet.</p>}
        </div>
      </div>
      <div className="team-tips" aria-label="Team tips">
        {analysis.tips.map((tip) => <p key={tip}><span aria-hidden="true">◇</span>{tip}</p>)}
      </div>
      {selectedWeakness && (
        <div className="analysis-focus" role="status">
          <span>Cards weak to {title(selectedWeakness)} are highlighted.</span>
          <button type="button" onClick={() => onRerollWeakness(selectedWeakness)}>Reroll highlighted unlocked slots</button>
        </div>
      )}
    </section>
  );
}
