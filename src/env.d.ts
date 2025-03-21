
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OAUTH_CLIENT_ID: string;
  readonly VITE_OAUTH_CLIENT_SECRET: string;
  readonly VITE_OAUTH_TOKEN_URL: string;
  readonly VITE_OAUTH_AUTH_URL: string;
  readonly VITE_USE_MOCK_API: string;
  // Waasabi API environment variables
  readonly VITE_USE_WAASABI_API: string;
  readonly VITE_WAASABI_API_URL: string;
  readonly VITE_WAASABI_CUSTOMER_ID: string;
  // Waasabi OAuth environment variables
  readonly VITE_WAASABI_OAUTH_CLIENT_ID: string;
  readonly VITE_WAASABI_OAUTH_CLIENT_SECRET: string;
  readonly VITE_WAASABI_OAUTH_TOKEN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
