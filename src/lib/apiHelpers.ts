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
