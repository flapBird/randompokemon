import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for RandomPokemon.xyz.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Privacy</span></nav>
      <span className="eyebrow">LAST UPDATED JULY 29, 2026</span>
      <h1>Privacy Policy</h1>
      <p className="lead">The generator works without an account and keeps your saved teams on your own device.</p>
      <h2>Information stored in your browser</h2>
      <p>RandomPokemon.xyz uses localStorage for your theme preference, up to ten recent generations, and up to twenty favorite teams. This information remains in your browser and can be removed from the generator or by clearing site data.</p>
      <h2>Server logs and analytics</h2>
      <p>Our hosting provider may process standard technical information such as IP address, browser type, requested pages, and timestamps to operate and secure the site. If privacy-friendly analytics are added later, this policy will be updated before collection begins.</p>
      <h2>Cookies</h2>
      <p>The first version does not use advertising cookies or account cookies. Browser storage is used only for the features described above.</p>
      <h2>External images</h2>
      <p>Pokémon artwork is loaded from public sprite hosts. Those providers may receive standard request information when your browser loads an image.</p>
      <h2>Your choices</h2>
      <p>You can use the generator without saving favorites. Clear recent history inside the app, or clear site data in your browser to remove all locally stored information.</p>
      <h2>Contact</h2>
      <p>Questions about this policy can be sent to privacy@randompokemon.xyz.</p>
    </article>
  );
}
