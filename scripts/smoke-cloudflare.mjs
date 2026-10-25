import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";

const origin = new URL(process.argv[2] ?? "http://localhost:4173");
let checks = 0;

async function request(path, status = 200, options = {}) {
  const response = await fetch(new URL(path, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
    ...options,
  });
  assert.equal(response.status, status, `${path}: unexpected HTTP status`);
  checks++;
  return response;
}

for (const path of [
  "/", "/pokemon", "/pokemon/pikachu", "/pokemon/pecharunt",
  "/pokemon/type/fire", "/random-shiny-pokemon-generator",
  "/favorite-pokemon-picker", "/pokemon-type-wheel", "/compare-pokemon",
  "/team-planner", "/blog/random-pokemon-generator-vs-randomizer",
]) {
  const response = await request(path);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  assert.equal(response.headers.get("x-robots-tag"), null, `${path}: clean URL must stay indexable`);
  const html = await response.text();
  assert.match(html, /<h1[\s>]/, `${path}: missing server-rendered content`);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  assert.ok(canonical, `${path}: missing canonical`);
  assert.equal(new URL(canonical).href, new URL(path, "https://randompokemon.xyz").href, `${path}: incorrect production canonical`);
}

// Test query requests between clean requests to detect static-cache contamination.
for (const path of ["/?seed=CF-SMOKE", "/pokemon/pikachu?shiny=1", "/team-planner?team=pikachu,charizard"]) {
  const response = await request(path);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, follow", `${path}: query URL must not be indexed`);
  await response.body?.cancel();
  const clean = await request(path.split("?")[0]);
  assert.equal(clean.headers.get("x-robots-tag"), null, `${path}: noindex leaked into the clean page`);
  await clean.body?.cancel();
}

const redirect = await request("/random-pokemon-team-generator?seed=CF-SMOKE", 308);
const target = new URL(redirect.headers.get("location"), origin);
assert.equal(target.pathname, "/");
assert.equal(target.searchParams.get("seed"), "CF-SMOKE");

for (const path of ["/missing-cf-smoke-page", "/pokemon/missing-cf-smoke-species"]) {
  const response = await request(path, 404);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/);
  await response.body?.cancel();
}

for (const path of ["/sitemap.xml", "/sitemap-pages.xml", "/sitemap-pokemon.xml", "/sitemap-blog.xml"]) {
  const response = await request(path);
  assert.match(response.headers.get("content-type") ?? "", /xml/);
  const xml = await response.text();
  assert.match(xml, /https:\/\/randompokemon\.xyz\//);
  if (path === "/sitemap-pokemon.xml") assert.equal([...xml.matchAll(/<loc>/g)].length, 1025);
}

for (const path of ["/robots.txt", "/llms.txt", "/ads.txt", "/favicon.svg", "/manifest.webmanifest"]) {
  const response = await request(path);
  assert.ok((await response.text()).length > 0, `${path}: empty asset`);
}
const dataset = await (await request("/data/pokemon.json")).json();
assert.equal(dataset.filter((entry) => entry.isDefaultForm).length, 1025);

const home = await (await request("/")).text();
const script = home.match(/src="([^" ]+\/_next\/static\/[^" ]+\.js)"/)?.[1]
  ?? home.match(/src="(\/_next\/static\/[^" ]+\.js)"/)?.[1];
assert.ok(script, "Homepage must reference the built client JavaScript");
const asset = await request(script);
assert.match(asset.headers.get("content-type") ?? "", /javascript/);
await asset.body?.cancel();

// Direct access to a real private prerender file must never expose its contents.
const assetRoot = new URL("../.cloudflare/output/v0/workers/default/assets/", import.meta.url);
const files = await readdir(assetRoot, { recursive: true });
const privateFile = files.find((path) => path.startsWith("_vinext/static-cache/") && path.endsWith(".html"));
assert.ok(privateFile, "Missing prerendered Static Assets; run npm run build:cf first");
const privateResponse = await request(`/${privateFile}`, 404);
await privateResponse.body?.cancel();

console.log(`Cloudflare smoke checks passed (${checks} requests against ${origin.origin}).`);
