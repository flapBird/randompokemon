import Link from "next/link";

const coreLinks = [
  ["/#generator", "Generator"],
  ["/favorite-pokemon-picker", "Favorite Picker"],
  ["/pokemon-type-wheel", "Type Wheel"],
  ["/team-planner", "Team Planner"],
  ["/pokemon", "Pokédex"],
] as const;

const generatorLinks = [
  ["/random-shiny-pokemon-generator", "Shiny Generator"],
  ["/random-pokemon-legendary-generator", "Legendary Generator"],
  ["/random-pokemon-starter-generator", "Starter Generator"],
  ["/#regions", "All Regions"],
] as const;

const siteLinks = [
  ["/blog", "Guides"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true"><span /></span><span>Random<span>Pokémon</span></span></div>
          <p>Build a surprising team, keep the picks you love, and share the exact result.</p>
        </div>
        <div className="footer-columns">
          {[["Explore", coreLinks], ["Generators", generatorLinks], ["Site", siteLinks]].map(([heading, links]) => (
            <nav className="footer-column" aria-label={heading as string} key={heading as string}>
              <h2>{heading as string}</h2>
              {(links as ReadonlyArray<readonly [string, string]>).map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
            </nav>
          ))}
        </div>
      </div>
      <div className="legal-copy">
        <p>RandomPokemon.xyz is an unofficial fan-made tool and is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.</p>
        <p>Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, Creatures Inc., and The Pokémon Company.</p>
      </div>
    </footer>
  );
}
