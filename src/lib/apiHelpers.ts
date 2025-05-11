/**
 * Simple function to log authentication errors
 * No automatic handling - just logging for now
 */
export function handleApiAuthError() {
  console.log("Authentication error detected - manual re-sign in required");
}

/**
 * Simple wrapper for fetch with timeout
 * @param url The URL to fetch
 * @param options Fetch options
 * @param timeoutMs Timeout in milliseconds (default: 5000)
 * @param progressCallback Optional callback for progress updates
 * @returns Promise resolving to fetch response
 */
// Configuration for API request timeouts
const endpointTimeouts = {
  // Endpoints that need longer timeouts
  '/api/repositories/create': 30000, // 30 seconds for repository creation
  '/api/repositories/update': 30000, // 30 seconds for updates
  'delete': 20000 // 20 seconds for repository deletion
};

export async function fetchWithAuth(
  url: string, 
  options?: RequestInit, 
  timeoutMs: number = 5000, 
  progressCallback?: (status: string) => void
): Promise<Response> {
  // Get the endpoint without query params
  const endpoint = url.split('?')[0];
  
  if (progressCallback) {
    progressCallback("Starting request...");
  }

  // Determine timeout based on the endpoint
  let effectiveTimeout = timeoutMs;
  
  // Check for specific endpoint configurations
  for (const [endpointPattern, timeout] of Object.entries(endpointTimeouts)) {
    if (endpoint.includes(endpointPattern)) {
      effectiveTimeout = timeout;
      break;
    }
  }
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const fetchOptions = options ? { ...options, signal: controller.signal } : { signal: controller.signal };
  
  // Set up timeout if applicable
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, effectiveTimeout);
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle authentication errors - manual re-sign in required
    if (response.status === 401) {
      console.warn(`Auth error (401) detected for ${url} - user needs to re-authenticate`);
      handleApiAuthError();
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${effectiveTimeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
