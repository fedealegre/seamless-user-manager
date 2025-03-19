
import { OAuth2Client } from "./oauth-client";
import { ApiClient } from "./api-client";
import { MockApiClient } from "./mock-api-client";

// Export the types
export * from "./types";

// Create the OAuth2Client (for a real implementation)
// const oauthClient = new OAuth2Client(
//   import.meta.env.VITE_OAUTH_CLIENT_ID || "mock-client-id",
//   import.meta.env.VITE_OAUTH_CLIENT_SECRET || "mock-client-secret",
//   "https://auth.example.com/oauth/token",
//   "https://auth.example.com/oauth/authorize"
// );
// export const apiService = new ApiClient(oauthClient, "https://api.example.com/v1");

// For now, we're exporting the MockApiClient instance to simulate the API
export const apiService = new MockApiClient();
// Re-export apiService as api for consistent naming across the codebase
export const api = apiService;
