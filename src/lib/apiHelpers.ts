/**
 * Broadcasts an authentication error event that will be caught by the SessionProvider
 */
// Track the last time we triggered an auth error to prevent flooding
let lastAuthErrorTime = 0;
const AUTH_ERROR_THROTTLE_MS = 5000; // Minimum ms between auth error events

export function handleApiAuthError() {
  const now = Date.now();
  
  // Throttle auth error events to prevent flooding
  if (now - lastAuthErrorTime > AUTH_ERROR_THROTTLE_MS) {
    lastAuthErrorTime = now;
    window.postMessage(
      { 
        type: "AUTH_ERROR", 
        timestamp: now 
      },
      window.location.origin,
    );
  } else {
    console.log("Auth error event throttled - too frequent");
  }
}

/**
 * Wrapper for fetch that handles authentication errors and request timeouts
 * @param url The URL to fetch
 * @param options Fetch options
 * @param timeoutMs Timeout in milliseconds (default: 5000)
 * @param retryOnAuth Whether to retry after auth refresh (default: false)
 * @returns Promise resolving to fetch response
 */
// Track in-progress retries to prevent duplicate retries
const pendingRetries = new Map<string, number>();

export async function fetchWithAuth(url: string, options?: RequestInit, timeoutMs: number = 5000, retryOnAuth: boolean = false): Promise<Response> {
  // Check if a retry for this URL is already in progress
  const currentTime = Date.now();
  const retryKey = `${url}:${JSON.stringify(options?.body || '')}`;
  const lastRetryTime = pendingRetries.get(retryKey);
  
  if (lastRetryTime && (currentTime - lastRetryTime < 5000)) {
    console.log(`Duplicate retry prevented for ${url}`);
    // Return a promise that resolves to a custom response indicating a retry is in progress
    return new Response(JSON.stringify({ retrying: true }), {
      status: 202, // Accepted - retrying
      statusText: "Retrying in progress",
      headers: { "Content-Type": "application/json" }
    });
  }

  // Create a timeout promise that rejects after specified milliseconds
  const timeout = new Promise<Response>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request to ${url} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  // Create the fetch promise with abort support
  const controller = new AbortController();
  const fetchOptions = options ? { ...options, signal: controller.signal } : { signal: controller.signal };
  
  const fetchPromise = fetch(url, fetchOptions).then(response => {
    // Handle auth errors (401)
    if (response.status === 401) {
      console.warn(`Auth error (401) detected for ${url}`);
      
      // Trigger auth refresh via event
      handleApiAuthError();
      
      // If we're set to retry, throw a specific error that will be caught
      if (retryOnAuth) {
        throw new Error("AUTH_REFRESH_NEEDED");
      }
    }
    
    // Successfully completed - clear any pending retry
    pendingRetries.delete(retryKey);
    return response;
  });
  
  // Race between fetch and timeout - abort fetch if timeout wins
  try {
    return await Promise.race([fetchPromise, timeout]);
  } catch (error) {
    controller.abort(); // Abort the fetch if it's still ongoing
    
    // If this is an auth refresh error and we want to retry
    if (error instanceof Error && 
        error.message === "AUTH_REFRESH_NEEDED" && 
        retryOnAuth) {
      
      // Mark this URL as having a retry in progress
      pendingRetries.set(retryKey, currentTime);
      
      // Wait for session refresh (give it time)
      console.log("Waiting for session refresh before retrying...");
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try again with the new token (but don't retry again to prevent loops)
        console.log("Retrying request after session refresh");
        const result = await fetchWithAuth(url, options, timeoutMs, false);
        
        // Clear pending retry after completion
        pendingRetries.delete(retryKey);
        return result;
      } catch (retryError) {
        // Clear pending retry on error
        pendingRetries.delete(retryKey);
        throw retryError;
      }
    }
    
    throw error;
  }
}
