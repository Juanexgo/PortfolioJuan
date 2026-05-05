import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isProtectedAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin";

  if (isProtectedAdminRoute) {
    const authToken = request.cookies.get("admin-auth");

    if (!authToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
