import { useEffect, useState } from 'react';
import { Provider } from '@shopify/app-bridge-react';

interface ShopifyProviderProps {
  children: React.ReactNode;
}

export const ShopifyProvider = ({ children }: ShopifyProviderProps) => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Get Shopify app configuration from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const host = urlParams.get('host');
    const shop = urlParams.get('shop');
    
    if (host && shop) {
      setConfig({
        apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || 'your_api_key_here',
        host: host,
        forceRedirect: true,
      });
    } else {
      // Fallback for development/testing
      setConfig({
        apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || 'your_api_key_here',
        host: btoa('test-store.myshopify.com/admin'),
        forceRedirect: false,
      });
    }
  }, []);

  if (!config) {
    return <div>Loading Shopify App...</div>;
  }

  return (
    <Provider config={config}>
      {children}
    </Provider>
  );
};