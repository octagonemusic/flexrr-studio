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
 * @param progressCallback Optional callback for progress updates (useful for long operations)
 * @returns Promise resolving to fetch response
 */
// Track in-progress retries to prevent duplicate retries
const pendingRetries = new Map<string, number>();

// Configuration for API request timeouts
const endpointTimeouts = {
  // Endpoints that should never timeout (value = 0)
  '/api/repositories/create': 0,
  '/api/repositories/update': 0,
  // Endpoints with extended timeouts
  'delete': 20000 // 20 seconds for repository deletion
};

export async function fetchWithAuth(
  url: string, 
  options?: RequestInit, 
  timeoutMs: number = 5000, 
  retryOnAuth: boolean = false,
  progressCallback?: (status: string) => void
): Promise<Response> {
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

  // Get the endpoint without query params
  const endpoint = url.split('?')[0]; // Remove query params
  
  if (progressCallback) {
    progressCallback("Starting request...");
  }

  // Determine timeout based on the endpoint
  let effectiveTimeout = timeoutMs; // Default timeout
  
  // Check for specific endpoint configurations
  for (const [endpointPattern, timeout] of Object.entries(endpointTimeouts)) {
    if (endpoint.includes(endpointPattern)) {
      effectiveTimeout = timeout;
      break;
    }
  }

  // If timeout is 0, it means no timeout should be applied
  const shouldSkipTimeout = effectiveTimeout === 0;
  
  if (shouldSkipTimeout) {
    console.log(`No timeout used for endpoint: ${endpoint}`);
  } else {
    console.log(`Using timeout of ${effectiveTimeout}ms for endpoint: ${endpoint}`);
  }
    
  const timeout = shouldSkipTimeout
    ? new Promise<Response>(() => {
        // This promise never resolves or rejects, effectively disabling the timeout
      })
    : new Promise<Response>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request to ${url} timed out after ${effectiveTimeout}ms`));
        }, effectiveTimeout);
      });
  
  // Create the fetch promise with abort support
  const controller = new AbortController();
  const fetchOptions = options ? { ...options, signal: controller.signal } : { signal: controller.signal };
  
  const fetchPromise = fetch(url, fetchOptions).then(response => {
    // Handle auth errors (401)
    if (response.status === 401) {
      console.warn(`Auth error (401) detected for ${url}`);
      
      if (progressCallback) {
        progressCallback("Authentication needed, refreshing session...");
      }
      
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
  
  // Race between fetch and timeout (if applicable)
  try {
    // For no-timeout endpoints, just use the fetch promise directly
    return shouldSkipTimeout ? await fetchPromise : await Promise.race([fetchPromise, timeout]);
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
      if (progressCallback) {
        progressCallback("Waiting for session refresh...");
      }
      
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try again with the new token (but don't retry again to prevent loops)
        console.log("Retrying request after session refresh");
        if (progressCallback) {
          progressCallback("Retrying request with refreshed session...");
        }
        
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
