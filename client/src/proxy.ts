import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/signin", "/terms", "/privacy", "/tips", "/support"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/api/auth");

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icons|manifest\\.json|sw\\.js).*)"],
};
