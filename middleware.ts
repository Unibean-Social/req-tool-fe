import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "authToken";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/login" || pathname === "/signUp" || pathname === "/forgot-password") return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  return false;
}

function safeRedirectPath(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname === "/" ? "/" : pathname);
    return NextResponse.redirect(url);
  }

  if (token && (pathname === "/login" || pathname === "/signUp" || pathname === "/forgot-password")) {
    const from = safeRedirectPath(request.nextUrl.searchParams.get("from"));
    const url = request.nextUrl.clone();
    url.pathname = from;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
