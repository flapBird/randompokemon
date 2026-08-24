import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.searchParams.size > 0) response.headers.set("X-Robots-Tag", "noindex, follow");
  return response;
}

// Share, filter, seed, search, and temporary state URLs remain useful to people,
// but every parameterized HTML route should stay out of the search index.
export const config = { matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"] };
