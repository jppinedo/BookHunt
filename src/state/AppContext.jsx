import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  // U2: which Profile tab is showing ('profile' | 'listings'). This
  // lives outside ProfilePage because the header menu needs it too —
  // its "My Listings" item deep-links to the Book Listings tab and is
  // marked active while that tab is on screen. (Lienzo Tabs is
  // uncontrolled, so ProfilePage reports switches up here instead of
  // the tab state being owned by the page alone.)
  const [profileTab, setProfileTab] = useState('profile');

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
      profileTab,
      setProfileTab,
      error,
      isError,
      onCloseError, 
      onShowError 
    }}>
      {children}
    </AppContext.Provider>
  );
};