/**
 * Lightweight formatting helpers safe for client bundles. This module must not
 * import the Pokémon dataset — client components depend on it, and a single
 * JSON import would pull the full 1,200-entry dataset into the browser chunk.
 */

export function titleToken(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
