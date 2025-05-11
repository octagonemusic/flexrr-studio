import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Simple hook for authentication functionality
 * Basic auth features with no automatic redirects
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * Sign in with GitHub
   * @param callbackUrl Optional URL to redirect to after sign in
   */
  const login = async (callbackUrl?: string) => {
    await signIn("github", { 
      callbackUrl: callbackUrl || window.location.pathname,
      redirect: true
    });
  };

  /**
   * Sign out the current user
   */
  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  /**
   * Check if the current status is authenticated
   */
  const isAuthenticated = status === "authenticated" && !!session?.user;

  return {
    session,
    status,
    isAuthenticated,
    login,
    logout,
  };
}

/**
 * Helper function to log auth errors
 */
export function logAuthError(errorInfo?: string) {
  console.error("Authentication error detected", errorInfo);
}