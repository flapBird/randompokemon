/**
 * Builds the browser-ready Pokémon dataset.
 *
 * By default this script asks PokéAPI's GraphQL endpoint for compact physical
 * and species metadata, then combines it with the versioned battle data in
 * @pkmn/dex. `--offline` skips the network request and is useful in CI or when
 * refreshing the bundled data without an internet connection.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Dex } from "@pkmn/dex";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "src/data/pokemon.json");
const publicOutputPath = resolve(root, "public/data/pokemon.json");
const offline = process.argv.includes("--offline");

const starterNames = new Set([
  "bulbasaur", "charmander", "squirtle", "pikachu", "eevee",
  "chikorita", "cyndaquil", "totodile", "treecko", "torchic", "mudkip",
  "turtwig", "chimchar", "piplup", "snivy", "tepig", "oshawott",
  "chespin", "fennekin", "froakie", "rowlet", "litten", "popplio",
  "grookey", "scorbunny", "sobble", "sprigatito", "fuecoco", "quaxly",
]);

const regions = ["", "Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"];
const allowedForm = /(alola|galar|hisui|paldea|mega|gmax)$/i;
const hisuiNativeSpecies = new Set(["wyrdeer", "kleavor", "ursaluna", "basculegion", "sneasler", "overqwil", "enamorus"]);

type ApiMeta = { height: number; category: string };

async function fetchPokeApiMetadata() {
  const query = `query GeneratorData {
    pokemon_v2_pokemon(where: {id: {_lte: 1025}, is_default: {_eq: true}}) {
      id height
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 9}}) { genus }
      }
    }
  }`;
  const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error(`PokéAPI returned ${response.status}`);
  const body = await response.json() as {
    data?: { pokemon_v2_pokemon?: Array<{
      id: number;
      height: number;
      pokemon_v2_pokemonspecy?: { pokemon_v2_pokemonspeciesnames?: Array<{ genus: string }> };
    }> };
  };
  const result = new Map<number, ApiMeta>();
  for (const item of body.data?.pokemon_v2_pokemon ?? []) {
    result.set(item.id, {
      height: item.height / 10,
      category: item.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames?.[0]?.genus ?? "Pokémon",
    });
  }
  return result;
}

let apiMetadata = new Map<number, ApiMeta>();
if (!offline) {
  try {
    apiMetadata = await fetchPokeApiMetadata();
    console.log(`Fetched ${apiMetadata.size} PokéAPI species records.`);
  } catch (error) {
    console.warn(`PokéAPI metadata was unavailable; using safe local fallbacks. ${String(error)}`);
  }
}

function evolutionStage(speciesName: string): 1 | 2 | 3 {
  let stage = 1;
  let current = Dex.species.get(speciesName);
  while (current.prevo && stage < 3) {
    stage += 1;
    current = Dex.species.get(current.prevo);
  }
  return stage as 1 | 2 | 3;
}

const records = Dex.species.all()
  .filter((species) => {
    if (!species.exists || species.num < 1 || species.num > 1025 || species.isNonstandard === "CAP") return false;
    if (!species.forme) return true;
    return allowedForm.test(species.forme) && !species.battleOnly;
  })
  .map((species) => {
    const slug = species.id;
    const isDefaultForm = !species.forme;
    const meta = apiMetadata.get(species.num);
    const tags = new Set(species.tags ?? []);
    const isMega = Boolean(species.isMega) || /mega/i.test(species.forme);
    const isGigantamax = /gmax/i.test(species.forme);
    const isRegionalForm = /(alola|galar|hisui|paldea)/i.test(species.forme);
    const region = /hisui/i.test(species.forme) || hisuiNativeSpecies.has(slug) ? "Hisui" : regions[species.gen] ?? "Unknown";
    const stats = species.baseStats;
    const baseSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${species.num}.png`;
    const baseShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${species.num}.png`;
    return {
      id: species.num,
      slug,
      name: species.name,
      generation: species.gen,
      region,
      types: species.types.map((type) => type.toLowerCase()),
      primaryType: species.types[0].toLowerCase(),
      abilities: Object.values(species.abilities).filter(Boolean),
      height: meta?.height ?? 1,
      weight: species.weightkg,
      stats: {
        hp: stats.hp,
        attack: stats.atk,
        defense: stats.def,
        specialAttack: stats.spa,
        specialDefense: stats.spd,
        speed: stats.spe,
      },
      bst: species.bst,
      evolutionStage: evolutionStage(species.name),
      fullyEvolved: (species.evos?.length ?? 0) === 0,
      isStarter: starterNames.has(slug),
      isLegendary: tags.has("Restricted Legendary") || tags.has("Sub-Legendary"),
      isMythical: tags.has("Mythical"),
      isParadox: tags.has("Paradox"),
      isUltraBeast: tags.has("Ultra Beast"),
      isRegionalForm,
      isMega,
      isGigantamax,
      isDefaultForm,
      category: meta?.category ?? "Pokémon",
      sprite: isDefaultForm ? baseSprite : `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`,
      shinySprite: isDefaultForm ? baseShiny : `https://play.pokemonshowdown.com/sprites/gen5-shiny/${slug}.png`,
    };
  })
  .sort((a, b) => a.id - b.id || Number(b.isDefaultForm) - Number(a.isDefaultForm) || a.slug.localeCompare(b.slug));

await mkdir(dirname(outputPath), { recursive: true });
await mkdir(dirname(publicOutputPath), { recursive: true });
const serialized = `${JSON.stringify(records)}\n`;
await Promise.all([
  writeFile(outputPath, serialized, "utf8"),
  writeFile(publicOutputPath, serialized, "utf8"),
]);
console.log(`Wrote ${records.length} normalized Pokémon records to ${outputPath} and ${publicOutputPath}`);
