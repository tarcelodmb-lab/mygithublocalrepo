import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { useEffect, useState } from 'react';

export const useShopify = () => {
  const app = useAppBridge();
  const [shop, setShop] = useState<string>('');
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    if (app) {
      // Check if running in Shopify admin
      const urlParams = new URLSearchParams(window.location.search);
      const shopParam = urlParams.get('shop');
      const embedded = urlParams.get('embedded') === '1';
      
      if (shopParam) {
        setShop(shopParam);
        setIsEmbedded(embedded);
      }
    }
  }, [app]);

  const redirect = (url: string) => {
    if (app && isEmbedded) {
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.REMOTE, url);
    } else {
      window.location.href = url;
    }
  };

  return {
    app,
    shop,
    isEmbedded,
    redirect,
  };
};