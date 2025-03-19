
import { OAuth2Client } from "./oauth-client";
import { ApiClient } from "./api-client";
import { MockApiClient } from "./mock-api-client";

// Export the types
export * from "./types";

// Check if we should use mock API
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_OAUTH_CLIENT_ID;

// Create the OAuth2Client (for a real implementation)
let apiService: ApiClient | MockApiClient;

if (!useMockApi) {
  // Real API implementation
  const oauthClient = new OAuth2Client(
    import.meta.env.VITE_OAUTH_CLIENT_ID || "",
    import.meta.env.VITE_OAUTH_CLIENT_SECRET || "",
    import.meta.env.VITE_OAUTH_TOKEN_URL || "https://auth.example.com/oauth/token",
    import.meta.env.VITE_OAUTH_AUTH_URL || "https://auth.example.com/oauth/authorize"
  );
  
  apiService = new ApiClient(
    oauthClient, 
    import.meta.env.VITE_API_BASE_URL || "https://api.example.com/v1"
  );
} else {
  // For development or testing, use the MockApiClient
  console.warn('Using mock API client. Set VITE_USE_MOCK_API=false to use real API.');
  apiService = new MockApiClient();
}

// Export the API service
export const api = apiService;
// Also export as apiService for backward compatibility
export { apiService };
