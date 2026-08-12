import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how RandomPokemon.xyz creates reproducible random Pokémon picks and teams.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="legal-page">
      <JsonLd data={breadcrumbSchema([["Home", "/"], ["About", "/about"]])} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>About</span></nav>
      <span className="eyebrow">ABOUT THE PROJECT</span>
      <h1>A better way to roll a random team.</h1>
      <p className="lead">RandomPokemon.xyz is a fast, independent tool for players who want more control than a single random button.</p>
      <h2>Why we built it</h2>
      <p>Simple Pokémon pickers are fun, but a useful team generator should let you keep a great roll, replace only one member, understand obvious defensive patterns, and share the exact same result. This site is designed around that full loop.</p>
      <h2>How randomness works</h2>
      <p>Each generation uses a stable seeded random number generator. The seed, filters, and mode determine the result. Shared URLs also carry the current picks so a team remains intact after locks and rerolls.</p>
      <h2>Data and privacy</h2>
      <p>The app reads a bundled Generation 1–9 dataset instead of downloading the full Pokédex while you use it. Recent rolls, theme preferences, and favorite teams stay in your browser. There is no account system.</p>
      <h2>How the project is maintained</h2>
      <p>RandomPokemon.xyz is maintained as an independent fan project. The dataset is built from versioned battle data and validated PokéAPI metadata, with automated checks for species coverage and supported forms. See the <Link href="/credits">Credits &amp; Data Sources</Link> page for the exact sources and the <Link href="/contact">Contact</Link> page to report an issue.</p>
      <h2>Fan-made disclaimer</h2>
      <p>RandomPokemon.xyz is an unofficial fan-made tool and is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.</p>
      <p>Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, Creatures Inc., and The Pokémon Company.</p>
    </article>
  );
}
