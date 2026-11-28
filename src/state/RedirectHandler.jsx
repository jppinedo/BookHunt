import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "@state/AuthContext";

const RedirectHandler = () => {
    const { user, passwordRecovery } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("Path: ", location.pathname)
        // U5: a password-recovery session (arrived from the reset
        // email link) goes to the set-new-password screen before
        // anything else, and stays there until the update clears
        // the recovery flag.
        if (passwordRecovery && location.pathname !== '/reset-password') {
            navigate('/reset-password');
            return;
        }
        if (location.pathname === '/reset-password') {
            return; // The reset screen guards itself (form or expired-link message).
        }
        if (user && (location.pathname === '/')) {
            navigate('/search'); // Redirect logged-in users to search
        } else if (!user && location.pathname !== '/login' && location.pathname !== '/registration') {
            navigate('/login'); // Redirect unauthenticated users to login
        }
    }, [user, passwordRecovery, navigate, location.pathname]);

    return null;
};

export default RedirectHandler;
