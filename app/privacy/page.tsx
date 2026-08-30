import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How RandomPokemon.xyz uses local storage, analytics, advertising technologies, and third-party services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Privacy</span></nav>
      <span className="eyebrow">LAST UPDATED AUGUST 30, 2026</span>
      <h1>Privacy Policy</h1>
      <p className="lead">RandomPokemon.xyz works without an account. This policy explains the browser storage, analytics, advertising technologies, and third-party services used when you visit the site.</p>

      <h2>Information you provide</h2>
      <p>You do not need to create an account or provide personal information to use the generator. If you email us, we receive your email address and any information you choose to include so that we can respond to your message. Please do not send passwords or other sensitive information.</p>

      <h2>Information stored in your browser</h2>
      <p>RandomPokemon.xyz uses local storage for your theme preference, up to ten recent generations, and up to twenty favorite teams. This information remains on your device, is not part of an account, and can be removed from the generator or by clearing site data in your browser.</p>

      <h2>Hosting logs and analytics</h2>
      <p>Our hosting provider may process standard technical information such as your IP address, browser and device type, requested pages, referring page, and timestamps to deliver, maintain, and secure the site.</p>
      <p>We use Google Analytics to understand visits, sessions, approximate location, and browser or device information. Google Analytics may use first-party cookies such as <code>_ga</code> and related identifiers. We do not intentionally send saved teams, filter selections, custom names, email addresses, or other directly identifying information to Google Analytics.</p>

      <h2>Google AdSense and advertising cookies</h2>
      <p>RandomPokemon.xyz includes Google AdSense advertising code. Even when an ad is not visible, an advertising tag may contact Google. Google and other third-party vendors or ad networks may place and read cookies on your browser, or use web beacons, IP addresses, and other identifiers, as a result of ad serving or the presence of advertising code on the site.</p>
      <p>Third-party vendors, including Google, use cookies to serve, limit, deliver, and measure ads. Google&apos;s use of advertising cookies enables Google and its partners to show personalized ads based on your visits to RandomPokemon.xyz and other sites when personalization is permitted. Non-personalized or limited ads may still use contextual information and technologies needed for ad delivery, frequency capping, aggregated reporting, security, and fraud prevention.</p>
      <p>Learn more about <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">how Google uses information from sites that use its services</a>, <a href="https://policies.google.com/technologies/cookies" rel="noopener noreferrer">how Google uses cookies</a>, and the <a href="https://policies.google.com/privacy" rel="noopener noreferrer">Google Privacy Policy</a>.</p>

      <h2>Consent and your advertising choices</h2>
      <p>Where consent is required by law, visitors may be shown a consent or privacy choices message before advertising cookies or personalized advertising are used. You can accept, reject, or manage the options offered in that message. The choices available to you may depend on your location and the services active on the site.</p>
      <p>You can control personalized ads through <a href="https://myadcenter.google.com/" rel="noopener noreferrer">Google My Ad Center</a> or opt out of some participating third-party vendors through <a href="https://optout.aboutads.info/" rel="noopener noreferrer">YourAdChoices</a>. You can also block or delete cookies and local storage through your browser settings. Blocking storage may affect saved preferences or some site features. To prevent Google Analytics from using your browser, you may install the <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>

      <h2>External images and links</h2>
      <p>Pokémon artwork is loaded from public sprite hosts. Those providers may receive standard request information, including your IP address, browser information, and the referring page, when your browser loads an image. Links to other websites are governed by those sites&apos; own privacy policies.</p>

      <h2>How information is used and shared</h2>
      <p>We use information to operate and secure the site, remember your on-device preferences, understand aggregate site usage, respond to messages, prevent fraud or abuse, and support advertising. Information may be processed by service providers that perform hosting, analytics, advertising, security, and content delivery functions. We do not maintain an account database and do not sell a list of registered users.</p>

      <h2>Retention</h2>
      <p>Local storage remains on your device until you remove it. Hosting, analytics, and advertising providers retain information according to their own policies and settings. Email correspondence is kept only as long as reasonably needed to answer the request, maintain records, or meet legal obligations.</p>

      <h2>Children&apos;s privacy</h2>
      <p>RandomPokemon.xyz is a general-audience fan-made tool and is not directed specifically to children under 13. We do not knowingly collect personal information from children through accounts or profiles. If you believe a child has sent us personal information, contact us so we can review and delete it where appropriate.</p>

      <h2>Your privacy rights</h2>
      <p>Depending on where you live, you may have rights concerning access, correction, deletion, restriction, objection, consent withdrawal, or complaints about personal information. Because most site preferences are stored only on your device, you can usually delete them directly by clearing site data. For information controlled by Google, use Google&apos;s privacy and advertising controls linked above. You may contact us about information you provided directly.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy when the site, its service providers, or legal requirements change. The date at the top of this page identifies the latest revision.</p>

      <h2>Contact</h2>
      <p>Questions or privacy requests can be sent to <a href="mailto:privacy@randompokemon.xyz">privacy@randompokemon.xyz</a>.</p>
    </article>
  );
}
