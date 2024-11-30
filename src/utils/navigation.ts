import { clearBrowserData } from './storage';

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.replace('/login');
  }
};

export const redirectToLandingWithPricing = () => {
  if (typeof window !== 'undefined') {
    window.location.replace('/?upgrade=true#pricing');
  }
};

export const handleSignOutNavigation = async () => {
  try {
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = 'none';
    }
    
    await clearBrowserData();
    await new Promise(resolve => setTimeout(resolve, 100));
    redirectToLogin();
  } finally {
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = '';
    }
  }
};