import { NextResponse } from "next/server";
import { connectDB } from "./mongoose";

export async function withErrorHandling(handler: Function, req: Request) {
  try {
    // Attempt MongoDB connection first
    await connectDB();
    // Run the handler
    return await handler(req);
  } catch (error) {
    console.error("API Error:", error);

    // Return appropriate error response based on error type
    if (error instanceof Error) {
      // Database connection errors
      if (
        error.message.includes("buffering timed out") ||
        error.message.includes("MongoDB connection error") ||
        error.message.includes("failed to connect to MongoDB")
      ) {
        return NextResponse.json(
          {
            code: "database_error",
            error: "Database connection error. Please try again later.",
            details: error.message,
          },
          { status: 503 },
        );
      }

      // Authentication errors
      else if (
        error.message.includes("Unauthorized") ||
        error.message.includes("No user ID in session") ||
        error.message.includes("not authenticated") ||
        error.message.includes("No authenticated user")
      ) {
        return NextResponse.json(
          {
            code: "auth_error",
            error: "Authentication required",
            details: "You must be signed in to access this resource",
          },
          { status: 401 },
        );
      }

      // GitHub API errors
      else if (error.message.includes("GitHub")) {
        return NextResponse.json(
          {
            code: "github_error",
            error: "GitHub API error",
            details: error.message,
          },
          { status: 502 },
        );
      }

      // Validation errors
      else if (error.message.includes("validation")) {
        return NextResponse.json(
          {
            code: "validation_error",
            error: "Validation error",
            details: error.message,
          },
          { status: 400 },
        );
      }

      // Not found errors
      else if (
        error.message.includes("not found") ||
        error.message.includes("Not found")
      ) {
        return NextResponse.json(
          {
            code: "not_found",
            error: "Resource not found",
            details: error.message,
          },
          { status: 404 },
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        code: "server_error",
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
