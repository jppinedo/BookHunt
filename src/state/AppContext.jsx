import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  // U9: the U2 profileTab state is gone — it tracked which Profile
  // tab was showing so the header menu could deep-link/mark the Book
  // Listings tab. My Listings is its own route now (/my-listings),
  // so the menu derives its active mark from the pathname like every
  // other item, and nothing needs the shared tab state.

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