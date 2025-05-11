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
    
    // Make a simple API call to check if token is valid
    // The /user endpoint is lightweight and gives us the username
    const { data } = await octokit.users.getAuthenticated();
    
    return {
      valid: true,
      username: data.login,
    };
  } catch (error: any) {
    // Handle various GitHub API errors
    if (error.status === 401) {
      return {
        valid: false,
        error: "Token expired or invalid",
      };
    }
    
    if (error.status === 403 && error.message?.includes("rate limit")) {
      return {
        valid: false,
        error: "Rate limit exceeded",
      };
    }
    
    return {
      valid: false,
      error: error.message || "Unknown error validating token",
    };
  }
}