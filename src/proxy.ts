import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight session-cookie gate. Full role checks happen server-side in
// pages and API routes via auth() — middleware only redirects unauthenticated
// users away from app pages.
const PUBLIC_PATHS = ["/login", "/register", "/api/auth", "/api/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const sessionCookie =
    req.cookies.get("authjs.session-token") ??
    req.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
