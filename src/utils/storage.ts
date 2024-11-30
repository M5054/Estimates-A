export const clearBrowserStorage = async () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const cookies = document.cookie.split(';');
      
      for (const cookie of cookies) {
        const name = cookie.split('=')[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  }
};