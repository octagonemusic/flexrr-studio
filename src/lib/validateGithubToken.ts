import { Octokit } from "@octokit/rest";

/**
 * Validates if a GitHub access token is still valid by making a simple API request
 * 
 * @param accessToken The GitHub access token to validate
 * @returns An object indicating if the token is valid and details if available
 */
export async function validateGithubToken(accessToken: string): Promise<{
  valid: boolean;
  username?: string;
  error?: string;
}> {
  if (!accessToken) {
    return { valid: false, error: "No token provided" };
  }

  try {
    const octokit = new Octokit({ auth: accessToken });
    
    // Add timeout to prevent long-running validation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Validation timed out")), 2000)
    );
    
    // Use a HEAD request to /user which is more efficient
    const validationPromise = octokit.request('HEAD /user');
    
    // Race validation against timeout
    await Promise.race([validationPromise, timeoutPromise]);
    
    return { valid: true };
  } catch (error: any) {
    // Check for timeout errors
    if (error.message === "Validation timed out") {
      // Assume token is valid if it times out to prevent blocking
      console.warn("Token validation timed out, assuming valid");
      return { valid: true, error: "Validation timed out, assuming valid" };
    }
    
    // Simplified error handling
    return {
      valid: false,
      error: error.status === 401 ? "Token expired or invalid" : 
             (error.message || "Unknown error validating token")
    };
  }
}