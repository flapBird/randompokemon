export const SITEMAP_BASE_URL = "https://randompokemon.xyz";

export type SitemapEntry = {
  path: string;
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
};

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] ?? character);
}

function absoluteUrl(path: string) {
  return `${SITEMAP_BASE_URL}${path === "/" ? "/" : path}`;
}

export function renderSitemapIndex(paths: string[]) {
  const entries = paths.map((path) => `<sitemap><loc>${escapeXml(absoluteUrl(path))}</loc></sitemap>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

export function renderUrlSet(entries: SitemapEntry[]) {
  const urls = entries.map(({ path, changeFrequency, priority }) => {
    const frequency = changeFrequency ? `<changefreq>${changeFrequency}</changefreq>` : "";
    const weight = priority === undefined ? "" : `<priority>${priority.toFixed(1)}</priority>`;
    return `<url><loc>${escapeXml(absoluteUrl(path))}</loc>${frequency}${weight}</url>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
