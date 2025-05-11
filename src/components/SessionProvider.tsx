"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
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
  const [isChecking, setIsChecking] = useState(false);
  const refreshAttemptRef = useRef(0);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [refreshTimestamp, setRefreshTimestamp] = useState(0); // Track last refresh time

  // Debounced refresh session function with throttling
  const refreshSession = useCallback(async () => {
    if (isProcessingAuth) return; // Prevent multiple simultaneous refreshes
    
    // Check if we've refreshed recently (within last 10 seconds)
    const now = Date.now();
    if (now - refreshTimestamp < 10000) {
      console.log("Skipping refresh - already refreshed recently");
      return;
    }
    
    try {
      setIsProcessingAuth(true);
      
      // Track attempts to avoid infinite loops
      refreshAttemptRef.current += 1;
      if (refreshAttemptRef.current > 2) {
        console.warn("Too many refresh attempts, redirecting to home");
        router.push("/");
        toast.error("Session could not be refreshed", { id: "session-refresh" });
        return;
      }
      
      // Show loading toast only on first attempt
      if (refreshAttemptRef.current === 1) {
        toast.loading("Refreshing your session...", { id: "session-refresh" });
      }
      
      // Add timeout to session update
      const updatePromise = update();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Session update timed out")), 3000)
      );
      
      try {
        await Promise.race([updatePromise, timeoutPromise]);
        
        // Record successful refresh timestamp
        setRefreshTimestamp(Date.now());
        
        // If token still missing after update, trigger sign-in
        if (!session?.user?.accessToken) {
          if (refreshAttemptRef.current === 1) {
            // Only redirect on first attempt
            await signIn("github", { callbackUrl: pathname, redirect: true });
          } else {
            // On subsequent attempts, just dismiss the error
            toast.error("Please sign in again", { id: "session-refresh" });
            router.push("/");
          }
        } else {
          toast.success("Session refreshed", { id: "session-refresh" });
          
          // Broadcast event that session was successfully refreshed so components can retry
          window.postMessage(
            { 
              type: "SESSION_REFRESHED",
              timestamp: Date.now()
            },
            window.location.origin
          );
        }
      } catch (error) {
        // If update times out, go to sign in page
        console.error("Session update timed out:", error);
        toast.error("Session refresh timed out", { id: "session-refresh" });
        router.push("/");
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
      toast.error("Session refresh failed", { id: "session-refresh" });
    } finally {
      setIsProcessingAuth(false);
    }
  }, [session, update, pathname, router, isProcessingAuth, refreshTimestamp]);

  // Light validation on initial load with timeout
  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      // Reset refresh counter on successful auth
      refreshAttemptRef.current = 0;
      
      // Only update refresh timestamp when it's not already set
      if (refreshTimestamp === 0) {
        setRefreshTimestamp(Date.now());
      }
      
      // Validate token with timeout
      const validationPromise = validateGithubToken(session.user.accessToken);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Token validation timed out")), 2000)
      );
      
      Promise.race([validationPromise, timeoutPromise])
        .then((result: unknown) => {
          // Type guard for the validation result
          if (result && typeof result === 'object' && 'valid' in result && !result.valid) {
            console.log("Token validation failed, refreshing session...");
            refreshSession();
          }
        })
        .catch((error) => {
          console.warn("Token validation failed:", error);
          // Continue without refresh on timeout
        });
    }
  }, [status, session?.user?.accessToken, refreshSession]);

  // Handle protected routes
  useEffect(() => {
    if (pathname === "/" || status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, pathname, router]);

  // Listen for auth error events from API calls with debouncing
  useEffect(() => {
    // Track pending refresh request
    let refreshPending = false;
    let refreshTimer: NodeJS.Timeout | null = null;
    
    const handleAuthEvent = (event: MessageEvent) => {
      if (event.data?.type === "AUTH_ERROR" && status === "authenticated") {
        console.log("Auth error detected, scheduling session refresh...");
        
        // Clear any pending refresh
        if (refreshTimer) {
          clearTimeout(refreshTimer);
        }
        
        // Only schedule if not already pending
        if (!refreshPending) {
          refreshPending = true;
          
          // Delay refresh slightly to collect multiple error events
          refreshTimer = setTimeout(() => {
            refreshSession();
            refreshPending = false;
            refreshTimer = null;
          }, 200);
        }
      }
    };

    window.addEventListener("message", handleAuthEvent);
    return () => {
      window.removeEventListener("message", handleAuthEvent);
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [status, refreshSession]);

  if (status === "loading" && pathname !== "/") {
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
