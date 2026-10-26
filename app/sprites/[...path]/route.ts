export const dynamic = "force-dynamic";

const UPSTREAM = {
  home: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home",
  showdown: "https://play.pokemonshowdown.com/sprites",
} as const;

const NUM_FILE = /^\d+\.png$/;
const SLUG_FILE = /^[a-z0-9-]+\.png$/;

export async function GET(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  let upstream: string | null = null;

  if (path.length === 1 && NUM_FILE.test(path[0])) {
    upstream = `${UPSTREAM.home}/${path[0]}`;
  } else if (path.length === 2 && path[0] === "shiny" && NUM_FILE.test(path[1])) {
    upstream = `${UPSTREAM.home}/shiny/${path[1]}`;
  } else if (path.length === 2 && path[0] === "forms" && SLUG_FILE.test(path[1])) {
    upstream = `${UPSTREAM.showdown}/gen5/${path[1]}`;
  } else if (path.length === 3 && path[0] === "forms" && path[1] === "shiny" && SLUG_FILE.test(path[2])) {
    upstream = `${UPSTREAM.showdown}/gen5-shiny/${path[2]}`;
  }

  if (!upstream) return new Response("Not found", { status: 404 });

  // 用 Cache API 做边缘缓存：vinext 的 fetch 包装不支持 cf.cacheTtl 选项
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const upstreamResponse = await fetch(upstream);
  if (!upstreamResponse.ok) return new Response("Not found", { status: 404 });

  const response = new Response(upstreamResponse.body, {
    headers: {
      "content-type": upstreamResponse.headers.get("content-type") ?? "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
  await cache.put(cacheKey, response.clone());
  return response;
}
