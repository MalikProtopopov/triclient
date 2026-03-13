import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  PUBLIC_PATHS,
  AUTH_PATHS,
  PUBLIC_DYNAMIC_PREFIXES,
} from "@/shared/config/routePaths";

const AUTH_ROUTES = new Set<string>(AUTH_PATHS);

function isPublicRoute(pathname: string): boolean {
  if ((PUBLIC_PATHS as readonly string[]).includes(pathname)) return true;
  if (PUBLIC_DYNAMIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.includes(".")) return true;
  return false;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get("has_session")?.value === "1";

  if (AUTH_ROUTES.has(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/cabinet", request.url));
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
