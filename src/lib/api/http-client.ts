import axios from 'axios';

// Global company ID storage and management
let globalCompanyId: string | null = null;

export const setGlobalCompanyId = (companyId: string | null) => {
  globalCompanyId = companyId;
  if (companyId) {
    localStorage.setItem('companyId', companyId);
  } else {
    localStorage.removeItem('companyId');
  }
};

export const getGlobalCompanyId = (): string | null => {
  // Check environment variable first (for testing)
  const envCompanyId = import.meta.env.VITE_COMPANY_ID;
  if (envCompanyId) {
    return envCompanyId;
  }
  
  // Then check in-memory value
  if (globalCompanyId) {
    return globalCompanyId;
  }
  
  // Finally check localStorage
  return localStorage.getItem('companyId');
};

// Create base HTTP client
export const createHttpClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  });

  // Add global interceptors
  client.interceptors.request.use((config) => {
    // Add authorization token (skip for login requests)
    if (!config.url?.includes('/login')) {
      const token = localStorage.getItem('token') || import.meta.env.VITE_AUTH_TOKEN || 'eyJhbGciO';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add company ID header for all requests except login
      const companyId = getGlobalCompanyId();
      if (companyId) {
        config.headers['x-consumer-custom-id'] = companyId;
      }
    }
    
    return config;
  });

  return client;
};

// Default HTTP client instances
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.daxiaplatform.com/backoffice/bo/v1';
const WAASABI_BASE_URL = 'https://api-sandbox.waasabi.io/bancorbff/api/v1/bo';

export const apiClient = createHttpClient(API_BASE_URL);
export const waasabiClient = createHttpClient(WAASABI_BASE_URL);