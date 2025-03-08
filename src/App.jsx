import React from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@state/AppContext';
import MenuNav from '@custom/Navigation/MenuNav';
import SearchPage from '@pages/SearchPage/SearchPage';
import LoginPage from '@pages/LoginPage/LoginPage';

function App() {

  return (
    <AppProvider>
      <Router>
        <MenuNav />
        <Routes>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/" element={<Root />} /> */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Catch-all route */}
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
