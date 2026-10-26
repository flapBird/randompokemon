import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How RandomPokemon.xyz uses local storage, analytics, and third-party services.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy", description: "How RandomPokemon.xyz uses local storage, analytics, and third-party services.", url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Privacy</span></nav>
      <span className="eyebrow">LAST UPDATED OCTOBER 27, 2026</span>
      <h1>Privacy Policy</h1>
      <p className="lead">RandomPokemon.xyz works without an account. This policy explains the browser storage, analytics, and third-party services used when you visit the site.</p>

      <h2>Information you provide</h2>
      <p>You do not need to create an account or provide personal information to use the generator. If you email us, we receive your email address and any information you choose to include so that we can respond to your message. Please do not send passwords or other sensitive information.</p>

      <h2>Information stored in your browser</h2>
      <p>RandomPokemon.xyz uses local storage for your theme preference, up to ten recent generations, and up to twenty favorite teams. This information remains on your device, is not part of an account, and can be removed from the generator or by clearing site data in your browser.</p>

      <h2>Hosting logs and analytics</h2>
      <p>Our hosting provider may process standard technical information such as your IP address, browser and device type, requested pages, referring page, and timestamps to deliver, maintain, and secure the site.</p>
      <p>We use Google Analytics to understand visits, sessions, approximate location, and browser or device information. Google Analytics may use first-party cookies such as <code>_ga</code> and related identifiers. We do not intentionally send saved teams, filter selections, custom names, email addresses, or other directly identifying information to Google Analytics.</p>

      <h2>Advertising</h2>
      <p>RandomPokemon.xyz does not currently include Google AdSense or any other third-party advertising code, and the site sets no advertising cookies. If advertising is ever introduced, this policy will be updated first, with the required disclosures about third-party vendors, web beacons, IP addresses, and other identifiers used for ad serving.</p>

      <h2>Consent and your browser controls</h2>
      <p>You can block or delete cookies and local storage through your browser settings. Blocking storage may affect saved preferences or some site features. To prevent Google Analytics from using your browser, you may install the <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>. More detail is available in the <a href="https://policies.google.com/technologies/cookies" rel="noopener noreferrer">Google cookies overview</a> and the <a href="https://policies.google.com/privacy" rel="noopener noreferrer">Google Privacy Policy</a>.</p>

      <h2>External images and links</h2>
      <p>Pokémon artwork is served from this site&apos;s own domain: our server fetches it from public sprite repositories and caches it, so your browser does not connect to those third-party hosts directly. Links to other websites are governed by those sites&apos; own privacy policies.</p>

      <h2>How information is used and shared</h2>
      <p>We use information to operate and secure the site, remember your on-device preferences, understand aggregate site usage, respond to messages, and prevent fraud or abuse. Information may be processed by service providers that perform hosting, analytics, security, and content delivery functions. We do not maintain an account database and do not sell a list of registered users.</p>

      <h2>Retention</h2>
      <p>Local storage remains on your device until you remove it. Hosting, analytics, and content delivery providers retain information according to their own policies and settings. Email correspondence is kept only as long as reasonably needed to answer the request, maintain records, or meet legal obligations.</p>

      <h2>Children&apos;s privacy</h2>
      <p>RandomPokemon.xyz is a general-audience fan-made tool and is not directed specifically to children under 13. We do not knowingly collect personal information from children through accounts or profiles. If you believe a child has sent us personal information, contact us so we can review and delete it where appropriate.</p>

      <h2>Your privacy rights</h2>
      <p>Depending on where you live, you may have rights concerning access, correction, deletion, restriction, objection, consent withdrawal, or complaints about personal information. Because most site preferences are stored only on your device, you can usually delete them directly by clearing site data. For information controlled by Google, use the analytics controls linked above. You may contact us about information you provided directly.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy when the site, its service providers, or legal requirements change. The date at the top of this page identifies the latest revision.</p>

      <h2>Contact</h2>
      <p>Questions or privacy requests can be sent to <a href="mailto:privacy@randompokemon.xyz">privacy@randompokemon.xyz</a>.</p>
    </article>
  );
}
