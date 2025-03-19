import React, {useContext, useEffect, useState} from 'react'
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AppProvider } from '@state/AppContext';
import { AuthContext } from "@state/AuthContext";
import MenuNav from '@custom/Navigation/MenuNav';
import HubNav from '@custom/Navigation/HubNav'
import SearchPage from '@pages/SearchPage/SearchPage';
import BookList from '@pages/BookList/BookList';
import BookSinglePage from './components/pages/BookSinglePage/BookSinglePage';
import SellBook from '@pages/SellBook/SellBook';
import NewBookPage from '@pages/NewBookPage/NewBookPage';
import LoginPage from '@pages/LoginPage/LoginPage';
import RegistrationPage from '@pages/RegistrationPage/RegistrationPage';
import ProfilePage from '@pages/ProfilePage/ProfilePage';
import BooksSavedPage from "@pages/BooksSavedPage/BooksSavedPage.jsx";
import {Protected} from "@/Protected.jsx";

function App() {
  const { user } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user)
  }, [user]);

  return (
    <AppProvider>
      <Router>
        <MenuNav />

        <Routes>
          <Route path="/search" element={<Protected><SearchPage /></Protected>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/results" element={<Protected><BookList /></Protected>} />
          <Route path="/book/:type/:id" element={<Protected><BookSinglePage /></Protected>} />
          <Route path="/sell" element={<Protected><SellBook /></Protected>} />
          <Route path="/new/:id" element={<Protected><NewBookPage /></Protected>} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
          <Route path="/saved" element={<Protected><BooksSavedPage /></Protected>} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Catch-all route */}
        </Routes>

        {isLoggedIn && location.pathname !== "/login" && location.pathname !== "/registration" && <HubNav />}
      </Router>
    </AppProvider>
  )
}

export default App
