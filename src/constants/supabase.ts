// Supabase Configuration Constants

export const SUPABASE_CONFIG = {
  // Auth settings
  AUTH: {
    AUTO_REFRESH_TOKEN: true,
    PERSIST_SESSION: true,
    DETECT_SESSION_IN_URL: true,
    FLOW_TYPE: 'pkce' as const,
  },
  
  // Database settings
  DATABASE: {
    DEFAULT_TABLE: 'items',
    BATCH_SIZE: 100,
    TIMEOUT: 30000, // 30 seconds
  },
  
  // Storage settings
  STORAGE: {
    DEFAULT_BUCKET: 'files',
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_FILE_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/json',
    ],
  },
  
  // Real-time settings
  REALTIME: {
    CHANNEL_PREFIX: 'supabase_changes',
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
} as const

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_NOT_CONFIRMED: 'Please check your email and confirm your account',
    WEAK_PASSWORD: 'Password is too weak',
    EMAIL_IN_USE: 'This email is already registered',
    NETWORK_ERROR: 'Network error. Please check your connection',
    UNKNOWN_ERROR: 'An unexpected error occurred',
  },
  
  DATABASE: {
    TABLE_NOT_FOUND: 'Table not found',
    PERMISSION_DENIED: 'You do not have permission to perform this action',
    VALIDATION_ERROR: 'Invalid data provided',
    CONSTRAINT_VIOLATION: 'Data violates database constraints',
    CONNECTION_ERROR: 'Unable to connect to database',
  },
  
  STORAGE: {
    FILE_TOO_LARGE: 'File is too large',
    INVALID_FILE_TYPE: 'File type not allowed',
    UPLOAD_FAILED: 'File upload failed',
    FILE_NOT_FOUND: 'File not found',
  },
} as const

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\s\-_]+$/,
  },
  
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
} as const

// API endpoints (if you have custom functions)
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    SIGN_OUT: '/auth/signout',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    DELETE_ACCOUNT: '/user/delete',
  },
  
  DATA: {
    ITEMS: '/data/items',
    ITEM_BY_ID: (id: string) => `/data/items/${id}`,
    SEARCH: '/data/search',
    BULK_OPERATIONS: '/data/bulk',
  },
} as const

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'supabase_auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  LAST_ACTIVITY: 'last_activity',
} as const

// Feature flags
export const FEATURES = {
  ENABLE_REAL_TIME: true,
  ENABLE_FILE_UPLOADS: true,
  ENABLE_USER_PROFILES: true,
  ENABLE_SEARCH: true,
  ENABLE_BULK_OPERATIONS: false,
  ENABLE_ANALYTICS: false,
} as const

// Performance settings
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_DELAY: 100, // milliseconds
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const 