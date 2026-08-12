import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true"><span /></span><span>Random<span>Pokémon</span></span></div>
          <p>Build a surprising team, keep the picks you love, and share the exact result.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Generator</Link>
          <Link href="/pokemon">Pokédex</Link>
          <Link href="/shiny-pokemon">Shiny Pokédex</Link>
          <Link href="/legendary-pokemon">Legendary Pokémon List</Link>
          <Link href="/starter-pokemon">Starter Pokémon List</Link>
          <Link href="/random-pokemon-starter-generator">Starter Generator</Link>
          <Link href="/random-pokemon-legendary-generator">Legendary Generator</Link>
          <Link href="/random-shiny-pokemon-generator">Shiny Generator</Link>
          <Link href="/random-nuzlocke-pokemon-generator">Nuzlocke Generator</Link>
          <Link href="/kanto-pokemon-generator">Kanto Generator</Link>
          <Link href="/paldea-pokemon-generator">Paldea Generator</Link>
          <Link href="/about">About</Link>
          <Link href="/credits">Credits & Data</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="legal-copy">
        <p>RandomPokemon.xyz is an unofficial fan-made tool and is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.</p>
        <p>Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, Creatures Inc., and The Pokémon Company.</p>
      </div>
    </footer>
  );
}
