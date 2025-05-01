import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Only apply middleware to protected routes
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/projects");

    // Skip middleware for non-protected routes
    if (!isProtectedRoute) {
      return NextResponse.next();
    }

    // Skip middleware for API routes
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthPage = request.nextUrl.pathname === "/";

    // Check if token exists and has necessary data
    const hasValidSession = token && token.sub;

    if (!hasValidSession && !isAuthPage) {
      console.log(
        "Invalid session detected in middleware, redirecting to home",
      );
      // Redirect unauthenticated users to home page
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is authenticated and tries to access the login page,
    // redirect them to the dashboard
    if (hasValidSession && isAuthPage) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Handle any errors by redirecting to home page
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    // Add routes that require authentication
    "/projects/:path*",
    // Add more protected routes as needed
  ],
};
