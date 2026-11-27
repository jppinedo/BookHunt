import React, { useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bookmark, List, Tag, User, LogOut } from 'react-feather';
import logoSmall from '@assets/images/BookHuntLogoSmall.png';
import { AuthContext } from "@state/AuthContext";
import { SearchContext } from '@state/SearchContext';

/**
 * AppRail — U10: navigation consolidation. The app used to split its
 * navigation between the HubNav bottom bar (3 tabs) and the MenuNav
 * hamburger (Sell Book, My Listings, Logout). On desktop that reads as
 * fragmented, so at the lg breakpoint (≥1024px) a Muse-style side rail
 * takes over: a fixed 72px white strip on the left edge holding the
 * logo and every section in one place, the active section in the same
 * solid coral pill as the bottom bar. HubNav and MenuNav hide at lg
 * (see App.jsx / App.css) and PageBrand hides too — the rail's logo is
 * the brand there. Below lg nothing changes: PageBrand, MenuNav and
 * the HubNav bottom bar render exactly as before.
 *
 * U10.1 — Juan's screenshot verdict on the first rail: the visible
 * micro-label under each icon, the CSS hover tooltip and the native
 * title tooltip showed the same label three times at once. The rail
 * is now icons only (24px glyphs in 48px targets): the CSS tooltip is
 * the single pointer label, the aria-label the single assistive one,
 * and the native title attribute is gone. Layout: logo pinned to the
 * top, Logout pinned to the bottom, the five sections vertically
 * centered between them. Hover is animated — a coral tint pill fades
 * and scales in behind the glyph while the glyph grows and turns
 * coral (see .rail-item in index.css); the active item keeps its
 * solid coral pill so hover never reads as active.
 *
 * Active state is route-derived, wider than HubNav's three tabs
 * because the rail lists every section: the deals list and deal
 * detail belong to Book Search (as in HubNav), the seller's listing
 * editor (/bookConfig) belongs to My Listings (its U9 home — HubNav
 * folds it into Profile because it has no Listings tab), and Sell's
 * second step (/new/:id) belongs to Sell Book.
 *
 * Logout reuses MenuNav's flow verbatim (AuthContext.signOut, then
 * /login). The logo click is the U7 homecoming: resetSearch +
 * /search, identical to PageBrand.
 */
const ITEMS = [
    { label: "Book Search", value: "/search", Icon: Search },
    { label: "Books Saved", value: "/saved", Icon: Bookmark },
    { label: "My Listings", value: "/my-listings", Icon: List },
    { label: "Sell Book", value: "/sell", Icon: Tag },
    { label: "Profile", value: "/profile", Icon: User },
];

const sectionForPath = (pathname) => {
    if (pathname === "/search" || pathname === "/results" || pathname.startsWith("/book/")) {
        return "/search";
    }
    if (pathname === "/saved") {
        return "/saved";
    }
    if (pathname === "/my-listings" || pathname.startsWith("/bookConfig/")) {
        return "/my-listings";
    }
    if (pathname === "/sell" || pathname.startsWith("/new/")) {
        return "/sell";
    }
    if (pathname === "/profile") {
        return "/profile";
    }
    return null;
};

const RailItem = ({ label, Icon, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        className={`rail-item group flex h-12 w-12 items-center justify-center rounded-2xl border-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral ${
            active
                ? 'is-active text-white bg-pio-coral shadow-sm'
                : 'text-pio-text-muted bg-transparent'
        }`}
    >
        <span className="rail-icon">
            <Icon size={24} aria-hidden="true" />
        </span>
        {/* The single visible label: a tooltip that appears to the
            right of the rail on hover. Pure CSS via group-hover;
            keyboard and assistive users get the aria-label instead. */}
        <span
            aria-hidden="true"
            className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-pio-text px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
        >
            {label}
        </span>
    </button>
);

const AppRail = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const { resetSearch } = useContext(SearchContext);

    const activeSection = sectionForPath(pathname);

    // Same logout flow as MenuNav: sign out, then to /login.
    async function handleLogout() {
        try {
            await signOut();
        } catch (error) {
            console.log(error)
        }
        navigate("/login");
    }

    return (
        <nav
            aria-label="App"
            className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col items-center border-r border-pio-grid bg-white py-3 lg:flex"
        >
            <button
                type="button"
                onClick={() => { resetSearch(); navigate('/search'); }}
                aria-label="Book Hunt — home"
                className="flex items-center justify-center rounded-full border-0 bg-transparent p-1.5 cursor-pointer transition-colors hover:bg-pio-coral-pale/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
            >
                <img src={logoSmall} alt="" style={{ width: '40px', height: '40px', display: 'block' }} />
            </button>

            {/* flex-1 + justify-center: the sections sit vertically
                centered in the space between the pinned logo and the
                pinned Logout. */}
            <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
                {ITEMS.map(({ label, value, Icon }) => (
                    <RailItem
                        key={value}
                        label={label}
                        Icon={Icon}
                        active={activeSection === value}
                        onClick={() => navigate(value)}
                    />
                ))}
            </div>

            <div>
                <RailItem label="Logout" Icon={LogOut} active={false} onClick={handleLogout} />
            </div>
        </nav>
    );
};

export default AppRail;
