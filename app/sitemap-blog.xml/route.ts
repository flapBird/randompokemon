import { publishedArticles } from "@/data/blog";
import { renderUrlSet, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(renderUrlSet([
    { path: "/blog", changeFrequency: "monthly", priority: 0.6 },
    ...publishedArticles.map((article) => ({
      path: `/blog/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]));
}
