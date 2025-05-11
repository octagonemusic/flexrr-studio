import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Skip middleware for API routes
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if token exists and has necessary data
    const hasValidSession = token && token.sub;

    if (!hasValidSession) {
      // Redirect unauthenticated users to home page
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Handle any errors by redirecting to home page
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    // Only include protected routes that need authentication
    "/projects/:path*",
  ],
};
