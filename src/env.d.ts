
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OAUTH_CLIENT_ID: string;
  readonly VITE_OAUTH_CLIENT_SECRET: string;
  readonly VITE_OAUTH_TOKEN_URL: string;
  readonly VITE_OAUTH_AUTH_URL: string;
  readonly VITE_USE_MOCK_API: string;
  // New environment variables for Waasabi API
  readonly VITE_USE_WAASABI_API: string;
  readonly VITE_WAASABI_API_URL: string;
  readonly VITE_WAASABI_CUSTOMER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
