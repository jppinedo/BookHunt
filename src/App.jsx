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
import BrandLockup from '@custom/Shared/BrandLockup';
import { AppContext } from '@state/AppContext';
import { AuthContext } from "@state/AuthContext";
import { SearchContext } from '@state/SearchContext';
import MenuNav from '@custom/Navigation/MenuNav';
import HubNav from '@custom/Navigation/HubNav';
import AppRail from '@custom/Navigation/AppRail';
import ErrorModal from '@custom/Error/ErrorModal';
import SearchPage from '@pages/SearchPage/SearchPage';
import BookList from '@pages/BookList/BookList';
import BookSinglePage from './components/pages/BookSinglePage/BookSinglePage';
import BookConfigSinglePage from "@pages/BookConfigSinglePage/BookConfigSinglePage";
import SellBook from '@pages/SellBook/SellBook';
import NewBookPage from '@pages/NewBookPage/NewBookPage';
import LoginPage from '@pages/LoginPage/LoginPage';
import RegistrationPage from '@pages/RegistrationPage/RegistrationPage';
import ResetPasswordPage from '@pages/ResetPasswordPage/ResetPasswordPage';
import ProfilePage from '@pages/ProfilePage/ProfilePage';
import MyListingsPage from '@pages/MyListingsPage/MyListingsPage';
import BooksSavedPage from "@pages/BooksSavedPage/BooksSavedPage";
import RedirectHandler from "@state/RedirectHandler.jsx";
import { Toasts } from '@state/ToastContext';
import { Protected } from "@/Protected";

/**
 * PageBrand — the brand button in the header of every logged-in page.
 * U1 gave it a visible label beside the logo, a matching aria-label,
 * and hover/focus treatment so it reads as tappable (the audit found
 * the old bare logo + wordmark didn't read as a button at all). U1.1:
 * Juan's rule is that the logo is ALWAYS visible and ALWAYS links
 * home — the deals and listing-detail screens had no header at all,
 * so PageBrand now renders on every logged-in route. The one
 * exception is /search itself: that page's large centered hero logo
 * is its brand lockup, and SearchPage makes it a Home button too, so
 * the rule holds there without stacking two logos.
 * U7 (Juan's review): the label reads "Book Hunt" — the wordmark, on
 * every page — never "Home"; and the click is a true homecoming: it
 * resets the search session (SearchContext.resetSearch) so it lands
 * on the clean home view, empty bar and no results, NOT the U1
 * preserved session. The wrapper also gains margin below so the
 * header never crowds the content under it.
 * U15 (Juan's review): the lockup is now the shared BrandLockup —
 * the compact horizontal mark + wordmark — and it renders at EVERY
 * width: U10 had retired it on desktop in favour of the rail's
 * logo, but Juan wants the logo always present, rail or no rail.
 * U16 (Juan's review of U15): no longer centered — the lockup sits
 * at the LEFT edge of the .page-shell, in line with the content
 * under it (and a step bigger; see BrandLockup). Below lg the ☰
 * MenuNav still sits at the shell's top-right edge, well clear of
 * the lockup at the left.
 */
function PageBrand() {
  const navigate = useNavigate();
  const { resetSearch } = useContext(SearchContext);
  return (
    <div className="page-shell pt-3 mb-2 flex">
      <BrandLockup onClick={() => { resetSearch(); navigate('/search'); }} />
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

  const showNav = isLoggedIn && pathname !== "/login" && pathname !== "/registration" && pathname !== "/reset-password";
  // U1.1: the brand header (logo + "Book Hunt") shows on EVERY
  // logged-in page — previously /results and /book/* had no header at
  // all. The only exception is /search, whose hero logo is the brand
  // there (and is itself a Home button; see SearchPage). U15: in the
  // /search RESULTS view the hero steps aside and SearchPage renders
  // the same small BrandLockup itself, so the rule — logo
  // always on top — holds in every state of every page.
  const showBrand = showNav && pathname !== "/search";

  return (
    <>
      {/* U10: the side rail renders only at lg (its own classes), and
          the content wrapper takes a matching left padding at lg so
          .page-shell centers in the space beside the rail instead of
          sliding under it. The fixed overlays (toasts, modals) are
          unaffected — they position against the viewport, and the
          wrapper has no transform/filter to trap them. Below lg the
          padding is absent and everything renders exactly as before. */}
      {showNav && <AppRail />}
      <div className={showNav ? 'lg:pl-[72px]' : undefined}>
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
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/my-listings" element={<Protected><MyListingsPage /></Protected>} />
        <Route path="/saved" element={<Protected><BooksSavedPage /></Protected>} />
        <Route path="*" element={<h1 className="on-bg-text" style={{marginTop: '4rem'}}>404 - Page Not Found</h1>} /> {/* Catch-all route */}
      </Routes>

      {showNav && <HubNav />}
      {/* U4: toast stack — rendered at shell level so a toast fired
          just before a navigation (e.g. "Listing deleted") is still
          visible on the destination screen. */}
      <Toasts />
      <ErrorModal showError={isError} error={error} onClose={onCloseError}/>
      </div>
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
