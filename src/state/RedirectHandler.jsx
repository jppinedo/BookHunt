import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "@state/AuthContext";

const RedirectHandler = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("Path: ", location.pathname)
        if (user && (location.pathname === '/')) {
            navigate('/search'); // Redirect logged-in users to search
        } else if (!user && location.pathname !== '/login' && location.pathname !== '/registration') {
            navigate('/login'); // Redirect unauthenticated users to login
        }
    }, [user, navigate, location.pathname]);

    return null;
};

export default RedirectHandler;