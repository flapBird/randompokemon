import type { FaqItem } from "@/components/content/Faq";

export const siteUrl = "https://randompokemon.xyz";

export function baseSchemas(faq: FaqItem[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Random Pokémon Generator",
      url: siteUrl,
      description: "A fast, filterable random Pokémon picker and team generator.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Random Pokémon Generator",
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      url: siteUrl,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Generate, lock, reroll, analyze, save, and share random Pokémon teams.",
    },
    faqSchema(faq),
  ];
}

export function faqSchema(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(items: Array<[string, string]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${path}`,
    })),
  };
}
