import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from '@jppinedo/lienzo';
import { Menu as MenuIcon, Tag, List, LogOut } from 'react-feather';
import { AuthContext } from "@state/AuthContext";

/**
 * MenuNav — was MUI AppBar + IconButton + Menu/MenuItem anchored to the
 * button, with Firebase signOut. The dropdown is still the Lienzo Menu
 * molecule (positioned with Tailwind — Lienzo Menu has no anchor/popover
 * positioning, noted as a gap), with the mock AuthContext signOut.
 *
 * Layout fix: the trigger used to be a Lienzo Button in its default
 * icon+label layout with no label — Button reserves a right margin for
 * the (missing) label, so the hamburger sat off-center in a wide,
 * short pill jammed 5px from the corner. Lienzo has no IconButton
 * (DS gap), so the trigger is now a plain square button: 44×44,
 * fully rounded, icon dead-center, 12px from the top-right corner,
 * with the dropdown spaced below it by the flex gap.
 *
 * U2: the menu held only "Sell Book" and "Logout", and the audit
 * found it didn't close on Escape and didn't reliably close when the
 * trigger was re-tapped. Changes:
 * - Items are now "Sell a Book", "My Listings", "Logout" — My Listings
 *   gives the selling list a direct route (it used to be buried under
 *   Profile → Book Listings). Each item carries a react-feather icon
 *   through Lienzo Label's icon prop, and the item for the screen
 *   you're on is marked with a coral icon + semibold label (Lienzo
 *   Menu items have no active state — DS gap).
 * - "My Listings" used to navigate to /profile with location state
 *   { tab: 'listings' } (ProfilePage read it and switched tabs). U9:
 *   My Listings is its own page — the item navigates straight to
 *   /my-listings and its active mark is pathname-derived, like Sell's.
 * - Close behaviour is handled HERE, not via Lienzo Menu's
 *   onClickOutside: that listener only knows the menu panel, so a
 *   mousedown on the trigger counted as "outside" and closed the menu
 *   just before the trigger's click toggled it back open — the
 *   re-tap bug. The wrapper below contains BOTH trigger and panel, so
 *   outside means truly outside; Escape closes too, and any route
 *   change closes the menu.
 */
const MenuNav = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { signOut } = useContext(AuthContext);
    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);

    // Close on any navigation (item selection included).
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close on outside mousedown / Escape while open.
    useEffect(() => {
        if (!open) return;

        function handlePointerDown(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        }

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open ]);

    // Should print null once logged out (mock auth: clears the demo user).
    async function handleLogout() {
        try {
            await signOut();
        } catch (error) {
            console.log(error)
        }
        setOpen(false);
        navigate("/login");
    }

    const onSell = pathname === "/sell" || pathname.startsWith("/new/");
    const onListings = pathname === "/my-listings";

    // Lienzo Label: the icon span's own colour is a pale gray for the
    // default type, so the feather icon carries its own text colour
    // (coral when the item is the current screen, muted otherwise).
    const itemLabel = (text, Icon, active) => ({
        text,
        icon: <Icon size={16} aria-hidden="true" className={active ? 'text-pio-coral' : 'text-pio-text-muted'} />,
        className: active ? 'font-semibold' : '',
    });

    return (
        // U6: the trigger used to be `absolute top-3 right-3` with no
        // positioned ancestor, so it pinned to the VIEWPORT's top-right
        // corner — on desktop it floated far right of the app column,
        // detached from the header (final audit finding). It now sits
        // inside the shared .page-shell (U1.2), so its right edge tracks
        // the column's content edge at every width. The -mr-1 keeps the
        // original 12px corner offset (the shell's padding is 16px), so
        // at phone widths — where the shell spans the full viewport —
        // the button lands exactly where it always did. The strip is
        // pointer-events-none except on the wrapper itself, so it never
        // blocks taps on the PageBrand header beneath it.
        // U10: hidden at lg — the AppRail carries Sell Book, My
        // Listings and Logout on desktop, so the hamburger retires
        // there. Below lg it renders exactly as before.
        <div className="pointer-events-none absolute inset-x-0 top-0 z-50 lg:hidden">
          <div className="page-shell">
            <div ref={wrapperRef} className="pointer-events-auto relative ml-auto flex w-fit flex-col items-end gap-2 pt-3 -mr-1">
            <button
                ref={triggerRef}
                type="button"
                aria-label="menu"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-pio-text border border-pio-grid shadow-[0_4px_14px_rgba(31,36,33,0.12)] cursor-pointer"
            >
                <MenuIcon size={21} aria-hidden="true" />
            </button>
            {open && (
                <Menu
                    items={[
                        {
                            label: itemLabel("Sell a Book", Tag, onSell),
                            onClick: () => {
                                setOpen(false);
                                navigate("/sell");
                            },
                        },
                        {
                            label: itemLabel("My Listings", List, onListings),
                            onClick: () => {
                                setOpen(false);
                                navigate("/my-listings");
                            },
                        },
                        {
                            label: { text: "Logout", type: "red", icon: <LogOut size={16} aria-hidden="true" /> },
                            onClick: handleLogout,
                        },
                    ]}
                />
            )}
            </div>
          </div>
        </div>
    )
}

export default MenuNav;
