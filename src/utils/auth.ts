import { clearBrowserStorage } from './storage';

export const handleAuthNavigation = async (beforeNavigate?: () => Promise<void>) => {
  if (typeof window === 'undefined') return;

  try {
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = 'none';
    }

    if (beforeNavigate) {
      await beforeNavigate();
    }

    await clearBrowserStorage();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const url = new URL(window.location.href);
    const baseUrl = `${url.protocol}//${url.host}`;
    window.location.replace(`${baseUrl}/login`);
  } finally {
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = '';
    }
  }
};

export const redirectToLandingWithPricing = () => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const baseUrl = `${url.protocol}//${url.host}`;
  window.location.replace(`${baseUrl}/?upgrade=true#pricing`);
};