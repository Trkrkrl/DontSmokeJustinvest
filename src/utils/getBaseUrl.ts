export const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
  
    // SSR veya fallback (çok nadir)
    return 'https://dont-smoke-justinvest.vercel.app';
  };
  