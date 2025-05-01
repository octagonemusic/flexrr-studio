"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    stack?: string;
    type: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Categorize error to determine action
    const categorizeError = (message: string): string => {
      if (
        message.includes("authentication") ||
        message.includes("unauthorized") ||
        message.includes("unauthenticated") ||
        message.includes("session")
      ) {
        return "auth";
      }

      if (message.includes("MongoDB") || message.includes("database")) {
        return "database";
      }

      if (message.includes("GitHub") || message.includes("API")) {
        return "api";
      }

      return "unknown";
    };

    // Add global error handler for synchronous errors
    const errorHandler = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);

      const errorMessage = event.error?.message || event.message;
      setErrorDetails({
        message: errorMessage,
        stack: event.error?.stack,
        type: categorizeError(errorMessage),
      });
      setHasError(true);

      // Show toast notification
      toast.error("An error occurred", {
        id: "global-error",
      });
    };

    // Separate handler for promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);

      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);

      setErrorDetails({
        message,
        stack: reason instanceof Error ? reason.stack : undefined,
        type: categorizeError(message),
      });
      setHasError(true);

      toast.error("An operation failed", {
        id: "promise-error",
      });
    };

    // Add event listeners
    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", rejectionHandler);

    // Clean up
    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, [router]);

  // Reset error state
  const resetError = () => {
    setHasError(false);
    setErrorDetails(null);
  };

  // Redirect based on error type
  const handleRedirect = () => {
    resetError();

    if (!errorDetails) {
      router.push("/");
      return;
    }

    switch (errorDetails.type) {
      case "auth":
        router.push("/");
        break;
      default:
        router.refresh();
        break;
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {errorDetails?.message || "An unexpected error occurred"}
          </p>
          {errorDetails?.type === "auth" && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-6">
              Your session may have expired. Please sign in again.
            </p>
          )}
          {errorDetails?.type === "database" && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-6">
              There was a problem connecting to the database. Please try again
              later.
            </p>
          )}
          {errorDetails?.type === "api" && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-6">
              There was a problem with an external service. Please try again
              later.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRedirect}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {errorDetails?.type === "auth" ? "Go to Login Page" : "Try Again"}
            </button>
            <button
              onClick={resetError}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
          {process.env.NODE_ENV === "development" && errorDetails?.stack && (
            <div className="mt-6 text-left">
              <details className="text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-auto max-h-40">
                <summary className="cursor-pointer mb-2 text-gray-700 dark:text-gray-300">
                  Error Details
                </summary>
                <pre>{errorDetails.stack}</pre>
              </details>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
