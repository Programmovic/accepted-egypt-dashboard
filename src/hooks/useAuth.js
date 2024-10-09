// hooks/useAuth.js

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [token, setToken] = useState(Cookies.get('client_token') || null); // Initialize state directly from the cookie

  useEffect(() => {
    const handleTokenChange = () => {
      const fetchedToken = Cookies.get('client_token'); // Get the token again
      setToken(fetchedToken || null); // Update state if the token is found
    };

    // Set an interval or a listener for any updates
    handleTokenChange(); // Call initially to check the token

    return () => {
      // Clean up if necessary
      // If using an event listener or interval, clear it here
    };
  }, []); // Empty dependency array means this runs once on component mount

  return token;
};

export default useAuth;
