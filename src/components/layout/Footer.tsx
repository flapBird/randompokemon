import Link from "next/link";

const generatorLinks = [
  ["/", "Random Pokémon Generator"],
  ["/random-pokemon-starter-generator", "Starter Generator"],
  ["/random-pokemon-legendary-generator", "Legendary Generator"],
  ["/random-shiny-pokemon-generator", "Shiny Generator"],
  ["/random-nuzlocke-pokemon-generator", "Nuzlocke Generator"],
  ["/kanto-pokemon-generator", "Kanto Generator"],
  ["/johto-pokemon-generator", "Johto Generator"],
  ["/hoenn-pokemon-generator", "Hoenn Generator"],
  ["/sinnoh-pokemon-generator", "Sinnoh Generator"],
  ["/unova-pokemon-generator", "Unova Generator"],
  ["/kalos-pokemon-generator", "Kalos Generator"],
  ["/alola-pokemon-generator", "Alola Generator"],
  ["/galar-pokemon-generator", "Galar Generator"],
  ["/paldea-pokemon-generator", "Paldea Generator"],
] as const;

const toolLinks = [
  ["/favorite-pokemon-picker", "Favorite Pokémon Picker"],
  ["/pokemon-type-wheel", "Pokémon Type Wheel"],
  ["/team-planner", "Team Planner"],
  ["/compare-pokemon", "Compare Pokémon"],
  ["/pokemon", "Pokédex"],
  ["/shiny-pokemon", "Shiny Pokédex"],
  ["/legendary-pokemon", "Legendary Pokémon List"],
  ["/starter-pokemon", "Starter Pokémon List"],
  ["/blog", "Guides"],
] as const;

const aboutLinks = [
  ["/about", "About"],
  ["/credits", "Credits & Data"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Use"],
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
          {[["Generators", generatorLinks], ["Tools", toolLinks], ["About", aboutLinks]].map(([heading, links]) => (
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
