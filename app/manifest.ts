import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Random Pokémon Generator",
    short_name: "RandomPokémon",
    description: "Generate, refine, analyze, save, and share random Pokémon teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7f2",
    theme_color: "#ea5b3f",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
