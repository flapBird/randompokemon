export const dynamic = "force-dynamic";

const UPSTREAM = {
  home: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home",
  showdown: "https://play.pokemonshowdown.com/sprites",
} as const;

const NUM_FILE = /^\d+\.png$/;
const SLUG_FILE = /^[a-z0-9-]+\.png$/;

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
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

  // cf 缓存选项仅 Cloudflare 运行时识别，Next 的 RequestInit 类型里没有
  const init = { cf: { cacheEverything: true, cacheTtl: 31536000 } } as unknown as RequestInit;
  const upstreamResponse = await fetch(upstream, init);
  if (!upstreamResponse.ok) return new Response("Not found", { status: 404 });

  return new Response(upstreamResponse.body, {
    headers: {
      "content-type": upstreamResponse.headers.get("content-type") ?? "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
