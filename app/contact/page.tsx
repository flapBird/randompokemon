import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact RandomPokemon.xyz about generator bugs, data corrections, privacy, or accessibility.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="legal-page">
      <JsonLd data={breadcrumbSchema([["Home", "/"], ["Contact", "/contact"]])} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Contact</span></nav>
      <span className="eyebrow">CONTACT THE PROJECT</span>
      <h1>Questions, corrections, and bug reports.</h1>
      <p className="lead">Tell us when a filter behaves unexpectedly, a Pokémon record looks wrong, or part of the site is difficult to use.</p>
      <h2>Product and data issues</h2>
      <p>Email <a href="mailto:privacy@randompokemon.xyz">privacy@randompokemon.xyz</a> and include the page URL, seed, filters, browser, and steps to reproduce when possible. Do not include passwords or other sensitive information.</p>
      <h2>Privacy questions</h2>
      <p>For privacy requests, email <a href="mailto:privacy@randompokemon.xyz">privacy@randompokemon.xyz</a>. The site has no account database; saved rolls and favorites are stored locally in your browser.</p>
      <h2>Before reporting Pokémon data</h2>
      <p>Check the <Link href="/credits">Credits &amp; Data Sources</Link> page for the source and update process. This generator uses a normalized national dataset and does not model the exact encounter tables, moves, or availability of a specific game.</p>
    </article>
  );
}
