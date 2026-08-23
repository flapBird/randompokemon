import type { FaqItem } from "@/components/content/Faq";

export const siteUrl = "https://randompokemon.xyz/";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: "RandomPokemon.xyz",
    url: siteUrl,
    logo: `${siteUrl}favicon.svg`,
    description: "An independent, fan-made random Pokémon generator project.",
  };
}

export function webApplicationSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    url: `${siteUrl}${path.replace(/^\//, "")}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description,
    publisher: { "@id": `${siteUrl}#organization` },
  };
}

export function baseSchemas(faq: FaqItem[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Random Pokémon Generator",
      url: siteUrl,
      description: "A fast, filterable random Pokémon picker and team generator.",
      publisher: { "@id": `${siteUrl}#organization` },
    },
    organizationSchema(),
    webApplicationSchema("Random Pokémon Generator", "/", "Generate, lock, reroll, analyze, save, and share random Pokémon teams."),
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
      item: `${siteUrl}${path.replace(/^\//, "")}`,
    })),
  };
}

export function collectionSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${siteUrl}${path.replace(/^\//, "")}`,
    description,
    publisher: { "@id": `${siteUrl}#organization` },
  };
}

export function pokemonSchema(entry: {
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: entry.name,
    url: `${siteUrl}pokemon/${entry.slug}`,
    description: entry.description,
    image: entry.image,
    additionalType: entry.category,
    isPartOf: { "@type": "WebSite", name: "RandomPokemon.xyz", url: siteUrl },
  };
}

export function articleSchema(entry: { title: string; path: string; description: string; datePublished: string; dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    datePublished: entry.datePublished,
    dateModified: entry.dateModified ?? entry.datePublished,
    mainEntityOfPage: `${siteUrl}${entry.path.replace(/^\//, "")}`,
    author: { "@id": `${siteUrl}#organization` },
    publisher: { "@id": `${siteUrl}#organization` },
  };
}
