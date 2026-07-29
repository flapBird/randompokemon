"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  ["/", "Generator"],
  ["/random-pokemon-team-generator", "Team Generator"],
  ["/random-pokemon-starter-generator", "Starter Generator"],
  ["/about", "About"],
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("rpg-theme");
      const shouldDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(shouldDark);
      document.documentElement.dataset.theme = shouldDark ? "dark" : "light";
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("rpg-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="Random Pokémon Generator home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Random<span>Pokémon</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`}>
            <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
          </button>
          <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label="Toggle navigation">
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className={`mobile-nav t-dropdown ${menuOpen ? "is-open" : ""}`} data-origin="top-right" aria-label="Mobile navigation">
        {links.map(([href, label]) => <Link href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
      </nav>
    </header>
  );
}
