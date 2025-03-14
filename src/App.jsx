import React from 'react'
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AppProvider } from '@state/AppContext';
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

function App() {
  return (
    <AppProvider>
      <Router>
        <MenuNav />

        <Routes>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/results" element={<BookList />} />
          <Route path="/book/:type/:id" element={<BookSinglePage />} />
          <Route path="/sell" element={<SellBook />} />
          <Route path="/new" element={<NewBookPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Catch-all route */}
        </Routes>

        <HubNav />
      </Router>
    </AppProvider>
  )
}

export default App
