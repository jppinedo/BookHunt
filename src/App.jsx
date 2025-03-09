//import { useState } from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuNav from './components/custom/Navigation/MenuNav';
import SearchPage from './components/pages/SearchPage/SearchPage';
import LoginPage from './components/pages/LoginPage/LoginPage';
import RegistrationPage from './components/pages/RegistrationPage/RegistrationPage';

function App() {
    return (
        <Router>
            <MenuNav />

            <Routes>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Catch-all route */}
            </Routes>
        </Router>
    )
}

export default App
