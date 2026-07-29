import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the Random Pokémon Generator.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Terms</span></nav>
      <span className="eyebrow">LAST UPDATED JULY 29, 2026</span>
      <h1>Terms of Use</h1>
      <p className="lead">By using RandomPokemon.xyz, you agree to use this fan-made tool lawfully and understand that results are provided for entertainment.</p>
      <h2>Permitted use</h2>
      <p>You may use generated Pokémon and teams for personal playthroughs, challenges, creative prompts, and friendly activities. Do not attempt to disrupt the service, automate abusive traffic, or misrepresent the site as an official Pokémon product.</p>
      <h2>No warranty</h2>
      <p>The site is provided “as is.” We aim for accurate data and reproducible results, but we do not guarantee uninterrupted availability, competitive viability, game-format legality, or error-free data.</p>
      <h2>Local data</h2>
      <p>Saved teams and recent generations are stored in your browser. You are responsible for copying any team you want to preserve before clearing browser data or changing devices.</p>
      <h2>Intellectual property</h2>
      <p>RandomPokemon.xyz is an unofficial fan-made tool and is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.</p>
      <p>Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, Creatures Inc., and The Pokémon Company. All other site design and original code belong to their respective creators.</p>
      <h2>Changes</h2>
      <p>These terms may change as the site evolves. Continued use after an update means you accept the revised terms.</p>
    </article>
  );
}
