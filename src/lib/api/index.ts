
import { OAuth2Client } from "./oauth-client";
import { ApiClient } from "./api-client";
import { MockApiClient } from "./mock-api-client";

// Export the types
export * from "./types";

// For now, we're exporting the MockApiClient instance directly
// In a real application, we would create an OAuth2Client and ApiClient
export const apiService = new MockApiClient();
// Re-export apiService as api for consistent naming across the codebase
export const api = apiService;
