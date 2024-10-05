import NProgress from 'nprogress';
import { Router } from 'next/router';
import { useEffect } from 'react';

export default function ProgressBar() {
  useEffect(() => {
    NProgress.configure({
      showSpinner: true, // Enable spinner
      speed: 500, // Progress speed
      minimum: 0.2, // Minimum percentage before animation starts
      easing: 'ease', // Animation easing
      trickleRate: 0.02,
      trickleSpeed: 300,
    });

    const handleRouteChangeStart = () => {
      NProgress.start();
    };

    const handleRouteChangeComplete = () => {
      NProgress.done();
    };

    const handleRouteChangeError = () => {
      NProgress.done();
    };

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeError);

    // Cleanup event listeners on unmount
    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, []);

  return null;
}
