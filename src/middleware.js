import { NextResponse } from "next/server";

// ─── Simple JWT decode (no signature verify — Edge-safe) ─────────────
// API routes still do full signature verification via jsonwebtoken.
function decodeJWTPayload(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Subdomain extraction ──────────────────────────────────────────────
function extractSubdomain(host) {
  const hostname = host.split(":")[0];

  // localhost: restaurant.localhost → "restaurant"
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, -".localhost".length);
    return sub || null;
  }

  // Production: restaurant.zreview.fr → "restaurant"
  const parts = hostname.split(".");
  if (parts.length > 2) {
    const sub = parts[0];
    return sub === "www" ? null : sub;
  }
  return null;
}

const PROTECTED_CLIENT = ["/dashboard"];
const PROTECTED_ADMIN = ["/admin"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const subdomain = extractSubdomain(host);

  // ─── Multi-tenant: rewrite subdomain requests to /s/[slug] ──────────
  if (subdomain) {
    if (!pathname.startsWith("/api/") && !pathname.startsWith("/_next/") && !pathname.startsWith("/s/")) {
      const url = request.nextUrl.clone();
      url.pathname = `/s/${subdomain}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // ─── Auth checks (main domain only) ─────────────────────────────────
  const token = request.cookies.get("zreview_token")?.value;
  const user = token ? decodeJWTPayload(token) : null;

  // Redirect authenticated users away from login/register
  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(
      new URL(user.role === "admin" ? "/admin" : "/dashboard", request.url)
    );
  }

  // Protect client dashboard
  if (PROTECTED_CLIENT.some((p) => pathname.startsWith(p))) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (user.role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Protect admin area
  if (PROTECTED_ADMIN.some((p) => pathname.startsWith(p))) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (user.role !== "admin") return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
