"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const generatorLinks = [
  { href: "/", title: "Random Pokémon Generator", copy: "Build one pick or a complete team" },
  { href: "/random-shiny-pokemon-generator", title: "Shiny Generator", copy: "Choose a random Shiny hunt target" },
  { href: "/random-pokemon-legendary-generator", title: "Legendary Generator", copy: "Roll from the Legendary pool" },
  { href: "/random-pokemon-starter-generator", title: "Starter Generator", copy: "Pick a first partner by generation" },
  { href: "/random-nuzlocke-pokemon-generator", title: "Nuzlocke Generator", copy: "Create a reproducible encounter" },
  { href: "/kanto-pokemon-generator", title: "Kanto Generator", copy: "Generate from the original 151" },
  { href: "/johto-pokemon-generator", title: "Johto Generator", copy: "Generate from Generation 2" },
  { href: "/hoenn-pokemon-generator", title: "Hoenn Generator", copy: "Generate from Generation 3" },
  { href: "/sinnoh-pokemon-generator", title: "Sinnoh Generator", copy: "Generate from Generation 4" },
  { href: "/unova-pokemon-generator", title: "Unova Generator", copy: "Generate from Generation 5" },
  { href: "/kalos-pokemon-generator", title: "Kalos Generator", copy: "Generate from Generation 6" },
  { href: "/alola-pokemon-generator", title: "Alola Generator", copy: "Generate from Generation 7" },
  { href: "/galar-pokemon-generator", title: "Galar Generator", copy: "Generate from Generation 8" },
  { href: "/paldea-pokemon-generator", title: "Paldea Generator", copy: "Generate from Generation 9" },
] as const;

const toolLinks = [
  { href: "/favorite-pokemon-picker", title: "Favorite Pokémon Picker", copy: "Find and share your Top 10" },
  { href: "/pokemon-type-wheel", title: "Pokémon Type Wheel", copy: "Spin all 18 types" },
  { href: "/team-planner", title: "Team Planner", copy: "Check coverage and team gaps" },
  { href: "/compare-pokemon", title: "Compare Pokémon", copy: "Compare stats and matchups" },
] as const;

const collectionLinks = [
  { href: "/shiny-pokemon", title: "Shiny Pokédex", copy: "Compare normal and Shiny artwork" },
  { href: "/legendary-pokemon", title: "Legendary Pokémon", copy: "Browse the complete Gen 1–9 list" },
  { href: "/starter-pokemon", title: "Starter Pokémon", copy: "Explore every first-partner trio" },
] as const;

type DesktopMenu = "tools" | "generators" | "collections" | null;

function NavChevron() {
  return (
    <svg className="nav-chevron" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <path d="M2.5 4.25 6 7.75l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuLink({ href, title, copy, active, onClick }: { href: string; title: string; copy: string; active: boolean; onClick: () => void }) {
  return (
    <Link href={href} className={active ? "nav-menu-link active" : "nav-menu-link"} aria-current={active ? "page" : undefined} onClick={onClick}>
      <span className="nav-menu-dot" aria-hidden="true" />
      <span><strong>{title}</strong><small>{copy}</small></span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<DesktopMenu>(null);
  const [dark, setDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const generatorButtonRef = useRef<HTMLButtonElement>(null);
  const toolButtonRef = useRef<HTMLButtonElement>(null);
  const collectionButtonRef = useRef<HTMLButtonElement>(null);
  const hoverCloseTimer = useRef<number | null>(null);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const generatorActive = generatorLinks.some((item) => isActive(item.href));
  const toolActive = toolLinks.some((item) => isActive(item.href));
  const collectionActive = collectionLinks.some((item) => isActive(item.href));
  const cancelHoverClose = useCallback(() => {
    if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = null;
  }, []);
  const closeMenus = useCallback(() => { cancelHoverClose(); setDesktopMenu(null); setMobileOpen(false); }, [cancelHoverClose]);
  const openDesktopMenu = useCallback((menu: Exclude<DesktopMenu, null>) => {
    cancelHoverClose();
    setDesktopMenu(menu);
  }, [cancelHoverClose]);
  const scheduleDesktopClose = useCallback(() => {
    cancelHoverClose();
    hoverCloseTimer.current = window.setTimeout(() => setDesktopMenu(null), 160);
  }, [cancelHoverClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("rpg-theme");
      const shouldDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(shouldDark);
      document.documentElement.dataset.theme = shouldDark ? "dark" : "light";
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mobileOpen && !desktopMenu) return;
    const closeFromOutside = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) closeMenus();
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (desktopMenu === "tools") toolButtonRef.current?.focus();
      else if (desktopMenu === "generators") generatorButtonRef.current?.focus();
      else if (desktopMenu === "collections") collectionButtonRef.current?.focus();
      else mobileButtonRef.current?.focus();
      closeMenus();
    };
    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [closeMenus, desktopMenu, mobileOpen]);

  useEffect(() => () => cancelHoverClose(), [cancelHoverClose]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("rpg-theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="Random Pokémon Generator home" onClick={closeMenus}>
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Random<span>Pokémon</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <div className="desktop-nav-item" onMouseEnter={() => openDesktopMenu("tools")} onMouseLeave={scheduleDesktopClose} onFocus={() => openDesktopMenu("tools")} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleDesktopClose(); }}>
            <button ref={toolButtonRef} className={toolActive ? "nav-trigger active" : "nav-trigger"} onClick={() => openDesktopMenu("tools")} aria-expanded={desktopMenu === "tools"} aria-controls="tools-menu"><span className="nav-trigger-label">Tools</span><NavChevron /></button>
            <div id="tools-menu" className={`nav-mega-menu collection-nav-menu t-dropdown ${desktopMenu === "tools" ? "is-open" : ""}`} data-origin="top-center" aria-hidden={desktopMenu !== "tools"} inert={desktopMenu !== "tools" ? true : undefined}><div className="nav-menu-heading"><span>INTERACTIVE TOOLS</span></div><div className="nav-menu-list">{toolLinks.map((item) => <MenuLink {...item} active={isActive(item.href)} onClick={closeMenus} key={item.href} />)}</div></div>
          </div>
          <div className="desktop-nav-item" onMouseEnter={() => openDesktopMenu("generators")} onMouseLeave={scheduleDesktopClose} onFocus={() => openDesktopMenu("generators")} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleDesktopClose(); }}>
            <button ref={generatorButtonRef} className={generatorActive ? "nav-trigger active" : "nav-trigger"} onClick={() => openDesktopMenu("generators")} aria-expanded={desktopMenu === "generators"} aria-controls="generator-menu"><span className="nav-trigger-label">Generators</span><NavChevron /></button>
            <div id="generator-menu" className={`nav-mega-menu generator-nav-menu t-dropdown ${desktopMenu === "generators" ? "is-open" : ""}`} data-origin="top-center" aria-hidden={desktopMenu !== "generators"} inert={desktopMenu !== "generators" ? true : undefined}>
              <div className="nav-menu-heading"><span>GENERATORS</span></div>
              <div className="nav-menu-grid">{generatorLinks.map((item) => <MenuLink {...item} active={isActive(item.href)} onClick={closeMenus} key={item.href} />)}</div>
            </div>
          </div>
          <Link href="/pokemon" aria-current={isActive("/pokemon") ? "page" : undefined} onClick={closeMenus}>Pokédex</Link>
          <div className="desktop-nav-item" onMouseEnter={() => openDesktopMenu("collections")} onMouseLeave={scheduleDesktopClose} onFocus={() => openDesktopMenu("collections")} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleDesktopClose(); }}>
            <button ref={collectionButtonRef} className={collectionActive ? "nav-trigger active" : "nav-trigger"} onClick={() => openDesktopMenu("collections")} aria-expanded={desktopMenu === "collections"} aria-controls="collection-menu"><span className="nav-trigger-label">Explore</span><NavChevron /></button>
            <div id="collection-menu" className={`nav-mega-menu collection-nav-menu t-dropdown ${desktopMenu === "collections" ? "is-open" : ""}`} data-origin="top-center" aria-hidden={desktopMenu !== "collections"} inert={desktopMenu !== "collections" ? true : undefined}>
              <div className="nav-menu-heading"><span>COLLECTIONS</span></div>
              <div className="nav-menu-list">{collectionLinks.map((item) => <MenuLink {...item} active={isActive(item.href)} onClick={closeMenus} key={item.href} />)}</div>
            </div>
          </div>
          <Link href="/blog" aria-current={isActive("/blog") ? "page" : undefined} onClick={closeMenus}>Blog</Link>
          <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} onClick={closeMenus}>About</Link>
        </nav>

        <div className="nav-actions">
          <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`}><span aria-hidden="true">{dark ? "☀" : "☾"}</span></button>
          <button ref={mobileButtonRef} className="icon-button mobile-menu-button" onClick={() => { setMobileOpen((value) => !value); setDesktopMenu(null); }} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label="Toggle navigation"><span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span></button>
        </div>
      </div>

      <nav id="mobile-menu" className={`mobile-nav t-dropdown ${mobileOpen ? "is-open" : ""}`} data-origin="top-right" aria-label="Mobile navigation" aria-hidden={!mobileOpen} inert={!mobileOpen ? true : undefined}>
        <span className="mobile-nav-label">Tools</span>
        {toolLinks.map((item) => <Link href={item.href} key={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={closeMenus}>{item.title}</Link>)}
        <span className="mobile-nav-label">Generators</span>
        {generatorLinks.map((item) => <Link href={item.href} key={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={closeMenus}>{item.title}</Link>)}
        <span className="mobile-nav-label">Browse</span>
        <Link href="/pokemon" aria-current={isActive("/pokemon") ? "page" : undefined} onClick={closeMenus}>Pokédex</Link>
        {collectionLinks.map((item) => <Link href={item.href} key={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={closeMenus}>{item.title}</Link>)}
        <span className="mobile-nav-label">Site</span>
        <Link href="/blog" aria-current={isActive("/blog") ? "page" : undefined} onClick={closeMenus}>Blog</Link>
        <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} onClick={closeMenus}>About</Link>
      </nav>
    </header>
  );
}
