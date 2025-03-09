import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [eBayToken, setEBayToken] = useState('');

  return (
    <AppContext.Provider value={{ eBayToken, setEBayToken }}>
      {children}
    </AppContext.Provider>
  );
};