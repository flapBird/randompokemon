import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://randompokemon.xyz/"),
  title: {
    default: "Random Pokémon Generator – All 1,025 Pokémon, Gen 1–9",
    template: "%s | RandomPokemon.xyz",
  },
  description: "Generate 1–6 random Pokémon from all nine generations with precise filters, seeded results, locks, rerolls, analysis, and sharing.",
  applicationName: "Random Pokémon Generator",
  openGraph: {
    type: "website",
    siteName: "Random Pokémon Generator",
    title: "Random Pokémon Generator – All 1,025 Pokémon, Gen 1–9",
    description: "Build, lock, reroll, analyze, and share a random team from every main species across Generations 1–9.",
    url: "https://randompokemon.xyz/",
    images: [{ url: "/og.png", width: 1200, height: 628, alt: "Random Pokémon Generator — Build. Lock. Reroll. Share." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Pokémon Generator",
    description: "Build, lock, reroll, analyze, and share your next random Pokémon team.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#121714" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
