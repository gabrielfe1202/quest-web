import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem('userId');
    console.log(user)
    setIsAuthenticated(user != null ? true : false);
  });

  return { isAuthenticated };
  
};
