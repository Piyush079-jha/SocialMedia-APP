import { useEffect } from 'react';

const AuthProtector =  ({ children }) => {

  useEffect(() => {

    if (!localStorage.getItem('userToken')) {
      window.location.href = '/landing';
    }
  }, []); // localStorage is not a valid reactive dep — runs once on mount


  return children;
};

export default AuthProtector;