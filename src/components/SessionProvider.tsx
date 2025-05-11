"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { validateGithubToken } from "@/lib/validateGithubToken";

type Props = {
  children: React.ReactNode;
  session: any;
};

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { status, data: session, update } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Silent re-login function
  const refreshSession = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      console.log("Attempting to refresh session...");
      
      // First try updating the session
      await update();
      
      // If update doesn't restore the token, trigger a full re-login
      if (!session?.user?.accessToken) {
        const currentPath = pathname;
        console.log("Session update didn't restore token, triggering re-login");
        toast.loading("Refreshing your session...", { id: "session-refresh" });
        await signIn("github", { callbackUrl: currentPath, redirect: true });
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [session, isRefreshing, update, pathname]);

  // Check token validity when session changes
  useEffect(() => {
    const validateToken = async () => {
      if (session?.user?.accessToken) {
        try {
          const result = await validateGithubToken(session.user.accessToken);
          if (!result.valid) {
            console.log("Token validation failed:", result.error);
            await refreshSession();
          }
        } catch (error) {
          console.error("Error validating token:", error);
        }
      }
    };

    if (status === "authenticated") {
      validateToken();
    }
  }, [status, session, refreshSession]);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for public routes
      if (pathname === "/") {
        setIsChecking(false);
        return;
      }

      if (status === "loading") {
        return; // Still loading, wait
      }

      if (status === "unauthenticated") {
        console.log("User not authenticated, redirecting to home");
        toast.error("Please sign in to access this page", {
          id: "auth-redirect",
        });
        router.push("/");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [status, pathname, router]);

  // Listen for auth error events from API calls
  useEffect(() => {
    const handleAuthEvent = (event: MessageEvent) => {
      if (
        event.data?.type === "AUTH_ERROR" && 
        status === "authenticated"
      ) {
        refreshSession();
      }
    };

    window.addEventListener("message", handleAuthEvent);
    return () => window.removeEventListener("message", handleAuthEvent);
  }, [status, refreshSession]);

  if (isChecking && pathname !== "/") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function SessionProvider({ children, session }: Props) {
  return (
    <Provider session={session}>
      <AuthCheck>{children}</AuthCheck>
    </Provider>
  );
}
