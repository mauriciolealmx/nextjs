import { useEffect } from 'react';
import { useRouter } from 'next/router';

import * as gtag from '../lib/gtag';

import Amplify from 'aws-amplify';
import config from '../aws-exports';

import '../styles/globals.css';

Amplify.configure({
  ...config,
  ssr: true,
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
