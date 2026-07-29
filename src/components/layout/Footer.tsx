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
          <Link href="/random-pokemon-team-generator">Team Generator</Link>
          <Link href="/random-pokemon-starter-generator">Starter Generator</Link>
          <Link href="/about">About</Link>
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
