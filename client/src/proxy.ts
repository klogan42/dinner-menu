import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/signin", "/terms", "/privacy", "/subscribe", "/tips", "/support"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/stripe");

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Subscription gate: redirect expired trials to /subscribe
  if (req.auth && !isPublic) {
    const status = req.auth.user.subscriptionStatus;
    const trialEnd = req.auth.user.trialEndsAt;
    const trialActive = trialEnd && new Date(trialEnd) > new Date();

    if (status !== "active" && status !== "free" && !trialActive) {
      return NextResponse.redirect(new URL("/subscribe", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icons|manifest\\.json|sw\\.js).*)"],
};
