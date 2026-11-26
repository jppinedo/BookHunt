import React, {useContext, useEffect, useState} from 'react'
import './App.css';
// MemoryRouter (not BrowserRouter): this preview runs inside a sandboxed
// iframe whose real URL is the host's gateway path, and the sandbox can
// block the History API outright (opaque origin). BrowserRouter therefore
// booted on an unmatched path (blank page) and every navigate() threw.
// MemoryRouter keeps all routing in memory: the app always starts at "/",
// RedirectHandler sends the demo user to /search, and no button ever
// touches the real address bar.
import {MemoryRouter as Router, Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import logoSmall from '@assets/images/BookHuntLogoSmall.png';
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

/**
 * PageBrand — small logo at the top-left for internal pages that are NOT
 * part of the book search flow (Saved Books, Profile, listing management).
 * The search-flow pages keep the large centered logo instead. Clicking it
 * returns to Book Search.
 */
function PageBrand() {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 pt-3 box-border">
      <button
        type="button"
        onClick={() => navigate('/search')}
        aria-label="Book Hunt — back to Book Search"
        className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-1"
      >
        <img src={logoSmall} alt="" style={{ width: '38px', height: '38px', display: 'block' }} />
        <span className="text-pio-text text-lg font-bold font-jakarta">Book Hunt</span>
      </button>
    </div>
  );
}

function AppShell() {
  const { user } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { error, onCloseError, isError } = useContext(AppContext);
  // Router location, not the global `location`: with MemoryRouter the real
  // address bar never changes, so the global pathname is meaningless here.
  const { pathname } = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!user)
  }, [user]);

  const showNav = isLoggedIn && pathname !== "/login" && pathname !== "/registration";
  // Small top-left logo on internal pages outside the search flow. The
  // search flow (/search, /results, /book/*, /sell) keeps its own header.
  const showBrand = showNav && (
    pathname === "/saved" ||
    pathname === "/profile" ||
    pathname.startsWith("/new") ||
    pathname.startsWith("/bookConfig")
  );

  return (
    <>
      {showNav && <MenuNav />}
      {showBrand && <PageBrand />}
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
        <Route path="*" element={<h1 className="on-bg-text" style={{marginTop: '4rem'}}>404 - Page Not Found</h1>} /> {/* Catch-all route */}
      </Routes>

      {showNav && <HubNav />}
      <ErrorModal showError={isError} error={error} onClose={onCloseError}/>
    </>
  )
}

function App() {
  return (
    <Router initialEntries={["/"]}>
      <AppShell />
    </Router>
  )
}

export default App
