/**
 * Backfills sprite paths for non-default Pokémon forms (Mega, Gmax, regional
 * variants) with PokéAPI "home" form artwork IDs (10001+). Showdown's gen5
 * sprite host does not serve most of these forms, so the previous URLs 404ed.
 * Forms with no match (currently the Legends Z-A megas) fall back to the
 * default form sprite so no page ever shows a broken image. Re-run whenever
 * PokéAPI adds new form rows to pick them up.
 *
 * Usage: tsx scripts/backfill-form-sprites.ts [--forms-file <path>]
 * The optional file holds a pre-fetched GraphQL response (useful behind
 * networks where the API is only reachable via proxy).
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildFormLookup, resolveFormId } from "./lib-form-sprites";

const root = resolve(new URL(".", import.meta.url).pathname, "..");

interface FormResponse { data?: { pokemon_v2_pokemon?: Array<{ id: number; name: string }> } }

async function fetchFormRows(): Promise<Array<{ id: number; name: string }>> {
  const formsFileIndex = process.argv.indexOf("--forms-file");
  if (formsFileIndex > -1) {
    const file = JSON.parse(await readFile(resolve(process.argv[formsFileIndex + 1]), "utf8")) as FormResponse;
    return file.data?.pokemon_v2_pokemon ?? [];
  }
  const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: "{ pokemon_v2_pokemon(where: {id: {_gte: 10001}}) { id name } }" }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`PokéAPI returned ${response.status}`);
  const body = (await response.json()) as FormResponse;
  return body.data?.pokemon_v2_pokemon ?? [];
}

interface PokemonEntry { slug: string; id: number; isDefaultForm: boolean; sprite: string; shinySprite: string }

async function backfill() {
  const { byExact, all } = buildFormLookup(await fetchFormRows());
  const misses: string[] = [];
  let matched = 0;

  for (const path of ["src/data/pokemon.json", "public/data/pokemon.json"]) {
    const file = resolve(root, path);
    const entries = JSON.parse(await readFile(file, "utf8")) as PokemonEntry[];
    for (const entry of entries) {
      if (entry.isDefaultForm) continue;
      const formId = resolveFormId(entry.slug, byExact, all);
      if (formId) {
        matched += 1;
        entry.sprite = `/sprites/${formId}.png`;
        entry.shinySprite = `/sprites/shiny/${formId}.png`;
      } else {
        misses.push(entry.slug);
        entry.sprite = `/sprites/${entry.id}.png`;
        entry.shinySprite = `/sprites/shiny/${entry.id}.png`;
      }
    }
    await writeFile(file, JSON.stringify(entries));
  }

  console.log(`matched ${matched} forms to home artwork; ${misses.length} fell back to default sprites`);
  if (misses.length) console.log("misses:", misses.join(", "));
}

backfill();
