# Random Pokémon Generator

Production-ready Next.js App Router website for [randompokemon.xyz](https://randompokemon.xyz), configured for native Vercel deployment. It generates reproducible Pokémon picks and teams with local Generation 1–9 data.

## Requirements

- Node.js 24.x

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

Copy `.env.example` to `.env.local` and add the GA4 Measurement ID when analytics is needed:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The Google tag is omitted entirely when the variable is empty or invalid.

## Validation

```bash
npm run lint
npm test
npm run build
```

## Pokémon data

The browser reads the checked-in static file at `public/data/pokemon.json`; `src/data/pokemon.json` is the normalized source copy. The app never downloads the full Pokédex from a third party at runtime. To refresh the data from PokéAPI metadata and the versioned `@pkmn/dex` package:

```bash
npm run data:update
```

If PokéAPI is unavailable, rebuild from the local package data:

```bash
npm run data:update:offline
```

The generator script normalizes Generation 1–9 species, approved regional forms, Mega Evolutions, Gigantamax forms, abilities, stats, starter status, and special categories.

## Deployment

The project can be imported directly into Vercel:

1. Import the GitHub repository in Vercel, or run `vercel link` from this directory.
2. Keep the framework preset as Next.js.
3. Use `npm run build`.
4. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel project environment variables for Production, Preview, or both.
5. Add `randompokemon.xyz` in the Vercel project domain settings and configure the DNS records Vercel provides.

No database or server-side data service is required. Analytics is optional and is enabled only when its environment variable is configured.
