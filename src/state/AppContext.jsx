import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);

  return (
    <AppContext.Provider value={{ currentBook, setCurrentBook }}>
      {children}
    </AppContext.Provider>
  );
};