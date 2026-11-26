import React from 'react';
import { useNavigate } from "react-router-dom";

/**
 * AuthSwitch — U5: the Login/Register switch as a segmented control.
 *
 * Replaces the low-contrast "Don't have an account? Register" text
 * link that used to sit at the bottom of each auth card (audit
 * finding: the only route between the two screens was an easily
 * missed text link). Same treatment on both screens, at the top of
 * the card: a muted track with the current screen as a solid coral
 * pill — the active-state language the bottom HubNav already uses.
 */
const AuthSwitch = ({ active }) => {
    const navigate = useNavigate();

    const option = (key, label, path) => {
        const isActive = active === key;
        return (
            <button
                type="button"
                onClick={() => { if (!isActive) navigate(path); }}
                aria-current={isActive ? "page" : undefined}
                className={
                    "flex-1 cursor-pointer rounded-full border-0 px-4 py-2.5 font-jakarta text-[15px] font-semibold transition-colors " +
                    (isActive
                        ? "bg-pio-coral text-white"
                        : "bg-transparent text-gray-500 hover:text-pio-text")
                }
            >
                {label}
            </button>
        );
    };

    return (
        <nav aria-label="Log in or register" className="flex gap-1 rounded-full bg-gray-opacity-14 p-1">
            {option('login', 'Log in', '/login')}
            {option('register', 'Register', '/registration')}
        </nav>
    );
};

export default AuthSwitch;
