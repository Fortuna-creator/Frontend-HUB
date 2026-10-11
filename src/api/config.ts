/**
 * API Integration Setup & Configuration Guide
 * 
 * This file should be called in App.tsx to initialize the API layer
 */

import { initializeIdempotency } from './idempotency';

/**
 * Initialize API layer on app startup
 * - Clean up expired idempotency records
 * - Setup error handlers
 */
export function initializeApi(): void {
  // Clean up old idempotency records
  initializeIdempotency();

  // Setup global error handler for API calls
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('API Error')) {
      console.error('Global API Error:', event.error);
      // Could trigger a toast notification here
    }
  });

  console.log('✅ API layer initialized');
}

/**
 * Configuration for different environments
 */
export const API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:8080/api',
    timeout: 30000,
    useMock: true,
  },
  staging: {
    baseUrl: 'https://staging-api.pkp.go.id/api',
    timeout: 30000,
    useMock: false,
  },
  production: {
    baseUrl: 'https://api.pkp.go.id/api',
    timeout: 30000,
    useMock: false,
  },
};

/**
 * Get current environment config
 */
export function getApiConfig(env: 'development' | 'staging' | 'production' = 'development') {
  return API_CONFIG[env];
}

/**
 * Setup mock data for demo
 * Remove or set useMock to false when backend is ready
 */
export const DEMO_MODE = {
  enabled: true,
  description: 'Demo mode uses mock data. Change USE_MOCK in src/api/service.ts to disable.',
};
