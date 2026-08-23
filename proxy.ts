import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.searchParams.size > 0) response.headers.set("X-Robots-Tag", "noindex, follow");
  return response;
}

export const config = { matcher: ["/"] };
