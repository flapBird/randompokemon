# SEO Architecture Strategy

Last updated: 2026-08-23

## Current strategy

Do not add new SEO page types without validated search demand.

Current page expansion is frozen while Google Search Console evaluates the new architecture. Product work should strengthen the existing tools, their category hubs, contextual internal links, and technical quality instead of creating additional keyword-variant or filter-combination pages.

## Architecture hierarchy

1. Homepage and Random Pokémon Generator
2. Four core tools: Favorite Pokémon Picker, Pokémon Type Wheel, Team Planner, Compare Pokémon
3. Four specialized generators: Shiny, Legendary, Starter, Nuzlocke
4. Region cluster: Kanto through Paldea
5. Pokédex hub
6. Eighteen type pages and 1,025 default-form Pokémon detail pages
7. Published supporting guides

Region pages remain indexable product pages, but they are a secondary cluster rather than global first-level links. Pokémon detail pages remain indexable and belong in the dedicated Pokémon sitemap.

## Expansion freeze

Do not add Generation 1–9 generator aliases, keyword-variant homepage aliases, filter-combination directories, type-by-generation pages, type-by-region pages, Pokémon combination matrices, move pages, ability pages, Fusion, Nickname, IV, Breeding, Quiz, Games, or large batches of blog content during this stabilization period.

Query-string states for seeds, filters, teams, search, sorting, pagination, and temporary results are user features, not indexable landing pages. They must retain a stable clean-path canonical and receive `noindex, follow` at the response level.

## Version notes

- Ranking change observed around 2026-08-09.
- Major product expansion occurred after 2026-08-12.
- SEO stabilization began with the current 2026-08-23 deployment.

The ranking change predates the product expansion. Do not attribute the earlier decline to the later Favorite Picker, Type Wheel, Region, or Pokédex work, and do not roll those useful pages back without new evidence.

## Publishing rules

- Blog pages list only published articles. Editorial roadmaps and planned topics stay internal.
- Preserve established production URLs. Any necessary future change requires a permanent redirect.
- Do not add draft, redirecting, non-canonical, noindex, 404, search, filter, seed, team-state, or other parameterized URLs to a sitemap.
- Do not automate backlinks, comments, directories, reciprocal-link networks, or other off-site authority schemes from this repository.

## Internal content backlog

Possible guide topics may be kept here for later validation: building a random team, Nuzlocke workflows, team challenges, type weaknesses, monotype teams, safe browser-based randomization, picker workflows, and reading base stats. These are not approved pages and must not appear publicly until individually reviewed and published.
