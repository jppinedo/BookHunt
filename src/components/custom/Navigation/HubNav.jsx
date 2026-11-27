import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bookmark, User } from 'react-feather';

/**
 * HubNav — was MUI BottomNavigation (Lienzo has NO BottomNavigation:
 * DS gap). Candidate new Lienzo molecule: BottomNavigation.
 *
 * Layout fix: this used to wrap the nav in a Lienzo Box, whose
 * double-layer panel (outer frame + inner content area, each padded)
 * made the bar ~110px tall, and #hubNav pinned it flush to bottom: 0.
 * It is now a single compact pill bar floating 14px above the bottom
 * edge (see #hubNav in App.css), with the three tabs sharing the bar's
 * width instead of a fixed 166px minimum.
 *
 * U2: the tabs were text-only and the active highlight was an exact
 * pathname match, so the deals list, deal detail, and Sell screens
 * showed NO active tab. Each tab now carries a react-feather icon
 * (the app's icon set — Search in SearchInput, Bookmark in BookCard)
 * above its label, and the active tab is DERIVED from the route:
 * search, results, and the deals/detail screens belong to Book
 * Search; the seller's own listing editor (/bookConfig) and the
 * My Listings page (/my-listings, U9) belong to Profile; /sell and
 * its second
 * step /new/:id belong to no tab (the breadcrumb orients there).
 */
const PAGES = [
    { label: "Book Search", value: "/search", Icon: Search },
    { label: "Books Saved", value: "/saved", Icon: Bookmark },
    { label: "Profile", value: "/profile", Icon: User },
];

const tabForPath = (pathname) => {
    if (pathname === "/search" || pathname === "/results" || pathname.startsWith("/book/")) {
        return "/search";
    }
    if (pathname === "/saved") {
        return "/saved";
    }
    if (pathname === "/profile" || pathname === "/my-listings" || pathname.startsWith("/bookConfig/")) {
        return "/profile";
    }
    return null;
};

const HubNav = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const selectedPage = tabForPath(pathname);

    return (
      <div id="hubNav">
        <nav
            aria-label="Hub"
            className="flex w-full items-center bg-white rounded-full border border-pio-grid shadow-[0_12px_32px_-6px_rgba(31,36,33,0.14),0_4px_12px_-2px_rgba(31,36,33,0.06)] p-1.5"
        >
            {PAGES.map((page) => {
                const active = selectedPage === page.value;
                const { Icon } = page;
                return (
                    <button
                        key={page.value}
                        type="button"
                        aria-current={active ? 'page' : undefined}
                        onClick={() => navigate(page.value)}
                        className={`flex-1 min-w-0 px-2 py-1.5 rounded-full border-0 cursor-pointer ${
                            active ? 'text-white bg-pio-coral shadow-sm' : 'text-pio-text-muted hover:text-pio-text bg-transparent'
                        }`}
                    >
                        <span className="flex flex-col items-center gap-0.5">
                            <Icon size={20} aria-hidden="true" />
                            <span className={`text-[15px] leading-tight whitespace-nowrap ${active ? 'font-semibold' : ''}`}>
                                {page.label}
                            </span>
                        </span>
                    </button>
                );
            })}
        </nav>
      </div>
    )
}

export default HubNav;
