import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * HubNav — was MUI BottomNavigation (Lienzo has NO BottomNavigation:
 * DS gap). Candidate new Lienzo molecule: BottomNavigation.
 *
 * Layout fix: this used to wrap the nav in a Lienzo Box, whose
 * double-layer panel (outer frame + inner content area, each padded)
 * made the bar ~110px tall, and #hubNav pinned it flush to bottom: 0.
 * It is now a single compact pill bar — 15px type, 8px vertical padding —
 * floating 14px above the bottom edge (see #hubNav in App.css), with the
 * three tabs sharing the bar's width instead of a fixed 166px minimum.
 */
const PAGES = [
    { label: "Book Search", value: "/search" },
    { label: "Books Saved", value: "/saved" },
    { label: "Profile", value: "/profile" },
];

const HubNav = () => {
    const currentLocation = useLocation();
    const navigate = useNavigate();

    const [selectedPage, setSelectedPage] = useState(currentLocation.pathname);

    useEffect(() => {
        setSelectedPage(currentLocation.pathname);
    }, [currentLocation.pathname]);

    return (
      <div id="hubNav">
        <nav
            aria-label="Hub"
            className="flex w-full items-center bg-white rounded-full border border-pio-grid shadow-[0_12px_32px_-6px_rgba(31,36,33,0.14),0_4px_12px_-2px_rgba(31,36,33,0.06)] p-1.5"
        >
            {PAGES.map((page) => {
                const active = selectedPage === page.value;
                return (
                    <button
                        key={page.value}
                        type="button"
                        aria-current={active ? 'page' : undefined}
                        onClick={() => {
                            setSelectedPage(page.value);
                            navigate(page.value);
                        }}
                        className={`flex-1 min-w-0 px-2 py-2 rounded-full text-center text-[15px] leading-tight border-0 cursor-pointer whitespace-nowrap ${
                            active ? 'text-white font-semibold bg-pio-coral shadow-sm' : 'text-pio-text-muted hover:text-pio-text bg-transparent'
                        }`}
                    >
                        {page.label}
                    </button>
                );
            })}
        </nav>
      </div>
    )
}

export default HubNav;
