export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  
  try {
    return window.location.origin;
  } catch (error) {
    console.error('Error getting base URL:', error);
    return '';
  }
};

export const getFullUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
};

export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  LANDING: '/',
  LANDING_WITH_PRICING: '/?upgrade=true#pricing',
  DASHBOARD: '/dashboard'
} as const;