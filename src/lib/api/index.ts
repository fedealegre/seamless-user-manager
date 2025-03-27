
import { ApiClient } from "./api-client";

// Export the types
export * from "./types";

let apiService: ApiClient;

// Export the API service
export const api = apiService;
// Also export as apiService for backward compatibility
export { apiService };

// Export user service
export { userService } from "./user-service";
