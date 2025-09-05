export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHECK_EMAIL: '/auth/check-email',
      CHECK_USERNAME: '/auth/check-username',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    
    // Transaction endpoints
    TRANSACTIONS: {
      BASE: '/transaction',
      BY_ID: (id: string) => `/transaction/${id}`,
      BY_USER: '/transaction/user',
      SEARCH: '/transaction/search',
      STATS: '/transaction/stats',
    },
    
    // Recurring transaction endpoints
    RECURRING_TRANSACTIONS: {
      BASE: '/recurring-transaction',
      BY_ID: (id: string) => `/recurring-transaction/${id}`,
      BY_USER: '/recurring-transaction/user',
      ACTIVATE: (id: string) => `/recurring-transaction/${id}/activate`,
      DEACTIVATE: (id: string) => `/recurring-transaction/${id}/deactivate`,
    },
    
    // User endpoints
    USERS: {
      BASE: '/users',
      BY_ID: (id: string) => `/users/${id}`,
      PROFILE: '/users/profile',
      SETTINGS: '/users/settings',
    },
  
    // Category endpoints (nếu có)
    CATEGORIES: {
      BASE: '/categories',
      BY_ID: (id: string) => `/categories/${id}`,
      BY_TYPE: (type: string) => `/categories/type/${type}`,
    },
  
    // Budget endpoints (nếu có)
    BUDGETS: {
      BASE: '/budgets',
      BY_ID: (id: string) => `/budgets/${id}`,
      BY_USER: '/budgets/user',
      CURRENT: '/budgets/current',
    },
  } as const;
  
  // Export types cho type safety
  export type ApiEndpoints = typeof API_ENDPOINTS;