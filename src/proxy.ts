import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

// Edge-safe auth instance (no Prisma adapter) for route protection.
const { auth } = NextAuth(authConfig);

const PROTECTED_PREFIXES = ["/read", "/account"];
const ADMIN_PREFIX = "/admin";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth?.user);
  const role = req.auth?.user?.role;
  const path = nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
  const isAdmin = path === ADMIN_PREFIX || path.startsWith(`${ADMIN_PREFIX}/`);

  if (isAdmin) {
    if (!isLoggedIn) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      // Hide the admin area from non-admins.
      return NextResponse.rewrite(new URL("/404", nextUrl));
    }
    return NextResponse.next();
  }

  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/read/:path*", "/account/:path*", "/admin/:path*"],
};
