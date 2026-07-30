# Random Pokémon Generator

Website: https://randompokemon.xyz

Random Pokémon Generator is a modern, mobile-friendly tool for generating individual Pokémon, complete teams, and random starters. It is designed for casual playthroughs, Nuzlocke challenges, themed runs, friendly challenges, and anyone who needs a quick random Pokémon picker.

## Main Features

- Generate one to six random Pokémon.
- Generate a complete team of six by default.
- Filter Pokémon by generation, type, region, evolution stage, base stat total, and special category.
- Choose between Pure Random and Smart Team generation.
- Lock team members and reroll only the remaining slots.
- Reroll or remove an individual Pokémon without changing the rest of the team.
- Switch between normal and shiny artwork.
- View Pokémon types, abilities, nature, stats, generation, region, and category details.
- Analyze team type distribution, shared weaknesses, resistances, and average base stat total.
- Reproduce the same result with a Seed.
- Copy a shareable team link or formatted team text.
- Save recent generations and favorite teams in local browser storage.
- Use dedicated Team Generator and Starter Generator modes.
- Use the generator on desktop, tablet, and mobile devices.
- Switch between light and dark themes.
- Track page visits with optional Google Analytics integration.

## Technology

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest
- Local Generation 1–9 Pokémon dataset
- Vercel deployment

## Local Development

Requirements:

- Node.js 24.x
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Run validation:

```bash
npm run lint
npm test
```

## Optional Google Analytics

Set the following environment variable to enable GA4 page-view tracking:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Google Analytics is not loaded when the variable is empty or invalid.
