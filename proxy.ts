import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const isDemo = process.env.IS_DEMO === "true";
const COOKIE_NAME = isDemo ? "demo_session" : "auth_session";

async function isValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = await isValidSession(request);

  const isExactAuthRoot = pathname === "/auth";
  const isSubAuthPage = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup");

  // ==========================================
  // TRYB: DEMO
  // ==========================================

  if (isDemo) {
    if (isSubAuthPage) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    if (!hasSession && !isExactAuthRoot) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    if (hasSession && isExactAuthRoot) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } 
  // ==========================================
  // TRYB: STANDARDOWY (NIE-DEMO)
  // ==========================================

  else {
    if (isExactAuthRoot) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const isProtected =
      pathname.startsWith("/cart") ||
      pathname.startsWith("/wishlist") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/library") ||
      pathname.startsWith("/reader");

    if (!hasSession && isProtected) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (hasSession && isSubAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};