import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Custom hook for handling authentication states and token refreshes
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  /**
   * Refresh the session when token issues are detected
   */
  const refreshSession = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await update(); // Try updating the session first
      
      // If the update doesn't solve the token issue, sign in again
      if (!session?.user?.accessToken) {
        await silentLogin();
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [session, isRefreshing, update]);

  /**
   * Silent login - redirects the user to GitHub auth but returns to the current page
   */
  const silentLogin = useCallback(async () => {
    const currentPath = window.location.pathname;
    toast.loading("Refreshing your session...", { id: "session-refresh" });
    
    try {
      await signIn("github", { 
        callbackUrl: currentPath,
        redirect: true
      });
      toast.success("Session refreshed", { id: "session-refresh" });
    } catch (error) {
      console.error("Silent login failed:", error);
      toast.error("Couldn't refresh your session", { id: "session-refresh" });
    }
  }, []);

  /**
   * Handle API authentication errors
   */
  const handleApiAuthError = useCallback(async () => {
    if (status === "authenticated" && !session?.user?.accessToken) {
      await refreshSession();
    }
  }, [status, session, refreshSession]);

  /**
   * Hook to handle global fetch responses and check for auth errors
   */
  const fetchWithAuth = useCallback(async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      
      // Check for auth errors
      if (response.status === 401) {
        // Only refresh if we think we're authenticated
        if (status === "authenticated") {
          await refreshSession();
          // Retry the request after refresh
          return fetch(url, options);
        }
        
        // If not authenticated, redirect to login
        router.push("/");
        throw new Error("Authentication required");
      }
      
      return response;
    } catch (error) {
      // If this is a network error, don't try to refresh
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw error;
      }
      
      // For other errors, check if they might be auth-related
      if (status === "authenticated") {
        await handleApiAuthError();
      }
      
      throw error;
    }
  }, [status, refreshSession, router, handleApiAuthError]);

  // Set up global event listener for auth errors
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

  return {
    session,
    status,
    isRefreshing,
    refreshSession,
    silentLogin,
    fetchWithAuth,
    signOut,
  };
}

/**
 * Broadcasts an auth error event that can be caught by the useAuth hook
 */
export function broadcastAuthError() {
  window.postMessage(
    {
      type: "AUTH_ERROR",
      message: "Authentication error detected",
    },
    window.location.origin
  );
}