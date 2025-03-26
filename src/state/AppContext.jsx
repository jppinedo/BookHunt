import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const onCloseError = () => {
    setError(null);
    setIsError(false);
  }

  const onShowError = (_error) => {
    setError(_error);
    setIsError(true);
  }

  return (
    <AppContext.Provider 
    value={{ 
      currentBook, 
      setCurrentBook, 
      error, 
      isError,
      onCloseError, 
      onShowError 
    }}>
      {children}
    </AppContext.Provider>
  );
};