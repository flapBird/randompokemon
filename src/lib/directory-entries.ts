import type { DirectoryPokemon } from "@/components/pokemon/PokemonDirectory";

export function directoryEntries(entries: DirectoryPokemon[]) {
  return entries.map(({ id, slug, name, generation, types, sprite, shinySprite }) => ({ id, slug, name, generation, types, sprite, shinySprite }));
}
