import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function checkAdminAuth(request: NextRequest) {
  try {
    // Check if the request is for admin routes
    if (!request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.next();
    }

    // Skip auth check for login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Make a request to the backend to verify admin authentication
    const token = request.cookies.get("token")?.value;
    
    const authResponse = await fetch(`${API_URL}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!authResponse.ok) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export function middleware(request: NextRequest) {
  return checkAdminAuth(request);
}

export const config = {
  matcher: "/admin/:path*",
};