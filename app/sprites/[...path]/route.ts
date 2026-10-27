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

  // Cache API 仅存在于 Cloudflare Workers 运行时；本地 next dev（Node）没有
  // caches 全局，此时跳过边缘缓存直接回源，浏览器仍会按 cache-control 缓存
  const cacheStore = (globalThis as { caches?: CacheStorage & { default?: Cache } }).caches?.default;
  const cacheKey = cacheStore ? new Request(request.url, { method: "GET" }) : null;
  if (cacheStore && cacheKey) {
    const cached = await cacheStore.match(cacheKey);
    if (cached) return cached;
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstream, { signal: AbortSignal.timeout(10_000) });
  } catch {
    // 回源失败（超时/断网）：返回不缓存的 503，浏览器下次会重试
    return new Response("Upstream unavailable", {
      status: 503,
      headers: { "cache-control": "no-store" },
    });
  }
  if (!upstreamResponse.ok) return new Response("Not found", { status: 404 });

  const response = new Response(upstreamResponse.body, {
    headers: {
      "content-type": upstreamResponse.headers.get("content-type") ?? "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
  if (cacheStore && cacheKey) await cacheStore.put(cacheKey, response.clone());
  return response;
}
