// Shopify OAuth utilities
export const generateAuthUrl = (shop: string, apiKey: string, redirectUri: string) => {
  const scopes = 'read_products,write_products,read_customers,write_customers';
  const state = Math.random().toString(36).substring(2, 15);
  
  const params = new URLSearchParams({
    client_id: apiKey,
    scope: scopes,
    redirect_uri: redirectUri,
    state: state,
    'grant_options[]': 'per-user'
  });

  // Store state for validation
  localStorage.setItem('shopify_oauth_state', state);
  
  return `https://${shop}.myshopify.com/admin/oauth/authorize?${params.toString()}`;
};

export const validateShopDomain = (shop: string): boolean => {
  const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
  return shopRegex.test(shop);
};

export const extractShopFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('shop');
};

export const isShopifyEmbedded = (): boolean => {
  return window.top !== window.self;
};