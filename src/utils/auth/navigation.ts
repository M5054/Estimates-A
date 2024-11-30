import { AUTH_EVENTS, AUTH_ROUTES } from './constants';
import { clearBrowserStorage } from './storage';

const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
};

const getFullUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return path;
  return `${baseUrl}${path}`;
};

const safeNavigate = (path: string): void => {
  try {
    const fullUrl = getFullUrl(path);
    console.log(`[Navigation] Redirecting to: ${fullUrl}`);
    window.location.replace(fullUrl);
  } catch (error) {
    console.error('[Navigation] Error during navigation:', error);
    window.location.replace(getFullUrl(AUTH_ROUTES.LOGIN));
  }
};

export const handleAuthNavigation = async (beforeNavigate?: () => Promise<void>): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    console.log(`[Auth] ${AUTH_EVENTS.NAVIGATION_START}`);
    
    // Disable user interaction during navigation
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = 'none';
    }

    // Execute pre-navigation tasks
    if (beforeNavigate) {
      await beforeNavigate();
    }

    // Clear all browser storage
    await clearBrowserStorage();
    
    // Small delay to ensure storage is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`[Auth] ${AUTH_EVENTS.NAVIGATION_END}`);
    safeNavigate(AUTH_ROUTES.LOGIN);
  } catch (error) {
    console.error('[Auth] Navigation error:', error);
    safeNavigate(AUTH_ROUTES.LOGIN);
  } finally {
    // Re-enable user interaction
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = '';
    }
  }
};

export const redirectToLandingWithPricing = (): void => {
  console.log('[Navigation] Redirecting to landing with pricing');
  safeNavigate(AUTH_ROUTES.LANDING_WITH_PRICING);
};

export const redirectToLogin = (): void => {
  console.log('[Navigation] Redirecting to login');
  safeNavigate(AUTH_ROUTES.LOGIN);
};

export const redirectToDashboard = (): void => {
  console.log('[Navigation] Redirecting to dashboard');
  safeNavigate(AUTH_ROUTES.DASHBOARD);
};