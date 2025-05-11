/**
 * Broadcasts an authentication error event that will be caught by the SessionProvider
 */
export function handleApiAuthError() {
  // Post a message that the SessionProvider will listen for
  window.postMessage(
    {
      type: "AUTH_ERROR",
      message: "API authentication failed",
    },
    window.location.origin,
  );
}

/**
 * Wrapper for fetch that handles authentication errors
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise resolving to fetch response
 */
export async function fetchWithAuth(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    // Check for authentication errors
    if (response.status === 401) {
      handleApiAuthError();
      throw new Error('Authentication required');
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error && 
       (error.message.includes('authentication') || 
        error.message.includes('token') ||
        error.message.includes('unauthorized') ||
        error.message.includes('expired'))) {
      // Handle auth-related errors
      handleApiAuthError();
    }
    throw error;
  }
}
