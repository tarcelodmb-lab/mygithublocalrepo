import { useEffect } from 'react';

// Shopify App Bridge integration component
export const ShopifyAppBridge = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize Shopify App Bridge when available
    if (typeof window !== 'undefined' && window.shopifyAppBridge) {
      const app = window.shopifyAppBridge.createApp({
        apiKey: process.env.SHOPIFY_API_KEY || '',
        host: new URLSearchParams(window.location.search).get('host') || '',
      });
      
      // Set up navigation
      const redirect = window.shopifyAppBridge.actions.Redirect.create(app);
      
      // Handle authentication
      window.shopifyApp = app;
    }
  }, []);

  return <>{children}</>;
};

// Type declarations for Shopify App Bridge
declare global {
  interface Window {
    shopifyAppBridge: any;
    shopifyApp: any;
  }
}

export default ShopifyAppBridge;