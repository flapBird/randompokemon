import { renderSitemapIndex, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(renderSitemapIndex([
    "/sitemap-pages.xml",
    "/sitemap-pokemon.xml",
    "/sitemap-blog.xml",
  ]));
}
