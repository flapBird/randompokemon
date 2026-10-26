/**
 * Maps Showdown form slugs (e.g. "charizardmegax") to PokéAPI form artwork IDs
 * (10001+) for the "home" sprite set. PokéAPI names forms with dashes and
 * sometimes longer words ("urshifu-single-strike-gmax"), so matching runs in
 * stages: alias table → exact normalized → trailing-mega strip → unique prefix.
 * Forms that match nothing (currently the Legends Z-A megas, which PokéAPI has
 * not added yet) return null and callers fall back to the default form sprite.
 */

const FORM_ALIASES: Record<string, string> = {
  // Showdown 简写 → PokéAPI 实际命名（归一化后仍无法自动匹配的）
  urshifugmax: "urshifusinglestrikegmax",
  toxtricitygmax: "toxtricityampedgmax",
  darmanitangalar: "darmanitangalarstandard",
  pikachualola: "pikachualolacap",
};

export function normalizeFormName(name: string) {
  return name.replace(/[^a-z0-9]/g, "");
}

export interface FormRow { id: number; name: string }

export function buildFormLookup(rows: FormRow[]) {
  const byExact = new Map<string, number>();
  const all: Array<{ key: string; id: number }> = [];
  for (const row of rows) {
    const key = normalizeFormName(row.name);
    if (!byExact.has(key)) byExact.set(key, row.id);
    all.push({ key, id: row.id });
  }
  return { byExact, all };
}

export function resolveFormId(slug: string, byExact: Map<string, number>, all: Array<{ key: string; id: number }>): number | null {
  const normalized = normalizeFormName(slug);
  const alias = FORM_ALIASES[normalized];
  if (alias && byExact.has(alias)) return byExact.get(alias)!;
  const exact = byExact.get(normalized);
  if (exact) return exact;
  // Legends Z-A 起部分形态 slug 以 mega 结尾但 PokéAPI 尚未收录对应行
  const stripped = normalized.replace(/mega[xy]?$/, "");
  const strippedHit = byExact.get(stripped);
  if (strippedHit) return strippedHit;
  // 唯一前缀匹配（如 darmanitangalar → darmanitangalarstandard）
  const prefixHits = all.filter((entry) => entry.key.startsWith(normalized) || normalized.startsWith(entry.key));
  if (prefixHits.length === 1) return prefixHits[0].id;
  return null;
}
