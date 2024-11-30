import { clearBrowserStorage } from './storage';
import { AUTH_EVENTS, AUTH_ROUTES } from './constants';

const getMobileBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
};

const getMobileFullUrl = (path: string): string => {
  const baseUrl = getMobileBaseUrl();
  return `${baseUrl}${path}`;
};

const handleMobileNavigation = (path: string): void => {
  try {
    const fullUrl = getMobileFullUrl(path);
    console.log(`[Mobile Navigation] Redirecting to: ${fullUrl}`);
    window.location.replace(fullUrl);
  } catch (error) {
    console.error('[Mobile Navigation] Error:', error);
    // Fallback to login page if navigation fails
    window.location.replace(getMobileFullUrl(AUTH_ROUTES.LOGIN));
  }
};

export const handleMobileAuthNavigation = async (
  beforeNavigate?: () => Promise<void>
): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    console.log(`[Mobile Auth] ${AUTH_EVENTS.NAVIGATION_START}`);
    
    // Disable interactions during navigation
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = 'none';
      document.body.style.opacity = '0.7';
    }

    // Execute pre-navigation tasks
    if (beforeNavigate) {
      await beforeNavigate();
    }

    // Clear all browser storage
    await clearBrowserStorage();
    
    // Small delay to ensure storage is cleared
    await new Promise(resolve => setTimeout(resolve, 150));
    
    console.log(`[Mobile Auth] ${AUTH_EVENTS.NAVIGATION_END}`);
    handleMobileNavigation(AUTH_ROUTES.LOGIN);
  } catch (error) {
    console.error('[Mobile Auth] Navigation error:', error);
    handleMobileNavigation(AUTH_ROUTES.LOGIN);
  } finally {
    // Re-enable interactions
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = '';
      document.body.style.opacity = '';
    }
  }
};

export const redirectMobileToLanding = (): void => {
  console.log('[Mobile Navigation] Redirecting to landing');
  handleMobileNavigation(AUTH_ROUTES.LANDING);
};

export const redirectMobileToLogin = (): void => {
  console.log('[Mobile Navigation] Redirecting to login');
  handleMobileNavigation(AUTH_ROUTES.LOGIN);
};

export const redirectMobileToDashboard = (): void => {
  console.log('[Mobile Navigation] Redirecting to dashboard');
  handleMobileNavigation(AUTH_ROUTES.DASHBOARD);
};

export const redirectMobileToLandingWithPricing = (): void => {
  console.log('[Mobile Navigation] Redirecting to landing with pricing');
  handleMobileNavigation(AUTH_ROUTES.LANDING_WITH_PRICING);
};