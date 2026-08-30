import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const policySource = readFileSync(
  fileURLToPath(new URL("../app/privacy/page.tsx", import.meta.url)),
  "utf8",
);

describe("privacy policy disclosures", () => {
  it("does not deny advertising-cookie use while AdSense code is present", () => {
    expect(policySource).not.toContain("does not use account cookies or advertising cookies of its own");
  });

  it("discloses AdSense data collection and third-party advertising technologies", () => {
    expect(policySource).toContain("Google AdSense");
    expect(policySource).toContain("third-party vendors or ad networks");
    expect(policySource).toContain("web beacons, IP addresses, and other identifiers");
    expect(policySource).toContain("personalized ads");
  });

  it("links to Google data-use information and advertising controls", () => {
    expect(policySource).toContain("https://policies.google.com/technologies/partner-sites");
    expect(policySource).toContain("https://myadcenter.google.com/");
    expect(policySource).toContain("https://optout.aboutads.info/");
  });
});
