import { NextResponse, type NextRequest } from "next/server";
import { resolveRequest } from "@/lib/routing/tenant-engine";
// import { createAuthServer } from "@neondatabase/auth/next/server";

// TODO: In production, move this to a Redis fetch or Edge Config.
const getTenantMap = async () => ({
  bloom: "tenant_bloom_001",
  gizmo: "tenant_gizmo_002",
  standard: "vayva-standard-id",
});

const isProtectedRoute = (pathname: string) => {
  const protectedPaths = [
    "/dashboard",
    "/onboarding",
    "/settings",
    "/control-center",
  ];
  return protectedPaths.some(p => pathname.startsWith(p));
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const query = Object.fromEntries(request.nextUrl.searchParams);
  // DEBUG COOKIES
  // console.log("Middleware Request:", {
  //   path: pathname,
  //   cookies: request.cookies.getAll().map(c => c.name)
  // });

  // 1. Tenant Resolution (AntiGravity Engine)
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/healthz");

  if (!isPublicAsset) {
    const tenantMap = await getTenantMap();
    const resolution = resolveRequest({
      hostname,
      path: pathname,
      query,
      tenantMap,
      env: process.env.NODE_ENV || "development",
    });

    if (resolution.action === "rewrite" && resolution.destination) {
      return NextResponse.rewrite(new URL(resolution.destination, request.url));
    }

    if (resolution.action === "redirect" && resolution.destination) {
      return NextResponse.redirect(
        new URL(resolution.destination, request.url),
      );
    }

    if (resolution.action === "not_found" && resolution.destination) {
      return NextResponse.rewrite(new URL(resolution.destination, request.url));
    }
  }

  // 2. Auth Guard & Root Redirect
  // Simple cookie check for performance in Edge Middleware
  // Check for both insecure and secure cookie names to be safe
  const hasSession =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  // Force root to signin or dashboard
  if (pathname === "/") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  if (isProtectedRoute(pathname)) {
    if (!hasSession) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // 3. Security Headers
  const response = NextResponse.next();
  // ... (security headers unchanged)
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.neon.tech https://*.neonauth.us-east-1.aws.neon.tech;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https://images.unsplash.com https://placehold.co;
        connect-src 'self' https://*.neon.tech https://*.neonauth.us-east-1.aws.neon.tech;
        font-src 'self' https://fonts.gstatic.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
