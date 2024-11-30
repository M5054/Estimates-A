export const AUTH_EVENTS = {
  SIGN_OUT_START: 'SIGN_OUT_START',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_ERROR: 'SIGN_OUT_ERROR',
  NAVIGATION_START: 'NAVIGATION_START',
  NAVIGATION_END: 'NAVIGATION_END'
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  LANDING: '/',
  LANDING_WITH_PRICING: '/?upgrade=true#pricing',
  DASHBOARD: '/dashboard'
} as const;

export const STORAGE_KEYS = {
  AUTH_STATE: 'auth_state',
  USER_SESSION: 'supabase.auth.token',
  REDIRECT_URL: 'redirect_url'
} as const;