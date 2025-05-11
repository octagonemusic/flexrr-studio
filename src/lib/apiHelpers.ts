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
 * @param timeoutMs Timeout in milliseconds (default: 15000)
 * @param progressCallback Optional callback for progress updates
 * @returns Promise resolving to fetch response
 */
// Configuration for API request timeouts
const endpointTimeouts = {
  // Endpoints with no timeouts (null to disable timeout)
  '/api/repositories/create': null, // No timeout for repository creation
  '/api/repositories/[id]/update': null, // No timeout for updates
  // Endpoints with longer timeouts
  'delete': 30000, // 30 seconds for repository deletion
  '/api/repositories/[id]/delete': 30000 // 30 seconds for repository deletion
};

export async function fetchWithAuth(
  url: string, 
  options?: RequestInit, 
  timeoutMs: number | null = 15000, 
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
  
  // Create abort controller
  const controller = new AbortController();
  const fetchOptions = options ? { ...options, signal: controller.signal } : { signal: controller.signal };
  
  // Set up timeout if applicable (null means no timeout)
  const timeoutId = effectiveTimeout !== null ? setTimeout(() => {
    controller.abort();
  }, effectiveTimeout) : null;
  
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
      throw new Error(`Request to ${url} timed out after ${effectiveTimeout || 'unknown'}ms`);
    }
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
