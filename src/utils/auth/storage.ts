import { STORAGE_KEYS } from './constants';

export const clearBrowserStorage = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    // Clear localStorage
    localStorage.clear();
    console.log('[Storage] localStorage cleared');

    // Clear sessionStorage
    sessionStorage.clear();
    console.log('[Storage] sessionStorage cleared');

    // Clear cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const domain = window.location.hostname;
      
      for (const cookie of cookies) {
        const name = cookie.split('=')[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
      console.log('[Storage] Cookies cleared');
    }
  } catch (error) {
    console.error('[Storage] Error clearing browser storage:', error);
  }
};

export const setRedirectUrl = (url: string): void => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.REDIRECT_URL, url);
  } catch (error) {
    console.error('[Storage] Error setting redirect URL:', error);
  }
};

export const getRedirectUrl = (): string => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.REDIRECT_URL) || '/dashboard';
  } catch (error) {
    console.error('[Storage] Error getting redirect URL:', error);
    return '/dashboard';
  }
};

export const clearRedirectUrl = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_URL);
  } catch (error) {
    console.error('[Storage] Error clearing redirect URL:', error);
  }
};

export const clearAuthState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    sessionStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    console.log('[Storage] Auth state cleared');
  } catch (error) {
    console.error('[Storage] Error clearing auth state:', error);
  }
};