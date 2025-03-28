import React, {useContext, useEffect, useState} from 'react'
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AppContext } from '@state/AppContext';
import { AuthContext } from "@state/AuthContext";
import MenuNav from '@custom/Navigation/MenuNav';
import HubNav from '@custom/Navigation/HubNav';
import ErrorModal from '@custom/Error/ErrorModal';
import SearchPage from '@pages/SearchPage/SearchPage';
import BookList from '@pages/BookList/BookList';
import BookSinglePage from './components/pages/BookSinglePage/BookSinglePage';
import BookConfigSinglePage from "@pages/BookConfigSinglePage/BookConfigSinglePage";
import SellBook from '@pages/SellBook/SellBook';
import NewBookPage from '@pages/NewBookPage/NewBookPage';
import LoginPage from '@pages/LoginPage/LoginPage';
import RegistrationPage from '@pages/RegistrationPage/RegistrationPage';
import ProfilePage from '@pages/ProfilePage/ProfilePage';
import BooksSavedPage from "@pages/BooksSavedPage/BooksSavedPage";
import RedirectHandler from "@state/RedirectHandler.jsx";
import { Protected } from "@/Protected";

function App() {
  const { user } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { error, onCloseError, isError } = useContext(AppContext);

  useEffect(() => {
    setIsLoggedIn(!!user)
  }, [user]);

  return (
    
    <Router>
      {isLoggedIn && location.pathname !== "/login" && location.pathname !== "/registration" && <MenuNav />}
      <RedirectHandler /> {/* Handles site load up for logged in or not logged in */}

      <Routes>
        <Route path="/search" element={<Protected><SearchPage /></Protected>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/results" element={<Protected><BookList /></Protected>} />
        <Route path="/book/:type/:id" element={<Protected><BookSinglePage /></Protected>} />
        <Route path="/bookConfig/:type/:id" element={<Protected><BookConfigSinglePage /></Protected>} />
        <Route path="/sell" element={<Protected><SellBook /></Protected>} />
        <Route path="/new/:id" element={<Protected><NewBookPage /></Protected>} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/saved" element={<Protected><BooksSavedPage /></Protected>} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Catch-all route */}
      </Routes>

      {isLoggedIn && location.pathname !== "/login" && location.pathname !== "/registration" && <HubNav />}
      <ErrorModal showError={isError} error={error} onClose={onCloseError}/>
    </Router>
  )
}

export default App
