import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const policySource = readFileSync(
  fileURLToPath(new URL("../app/privacy/page.tsx", import.meta.url)),
  "utf8",
);

describe("privacy policy disclosures", () => {
  it("does not claim active ad serving while no advertising code ships", () => {
    expect(policySource).toContain("does not currently include Google AdSense");
    expect(layoutSource()).not.toContain("adsbygoogle");
  });

  it("discloses Google Analytics collection", () => {
    expect(policySource).toContain("Google Analytics");
    expect(policySource).toContain("_ga");
  });

  it("links to Google data-use information and opt-out controls", () => {
    expect(policySource).toContain("https://policies.google.com/privacy");
    expect(policySource).toContain("https://tools.google.com/dlpage/gaoptout");
  });
});

function layoutSource() {
  return readFileSync(fileURLToPath(new URL("../app/layout.tsx", import.meta.url)), "utf8");
}
