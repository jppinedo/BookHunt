import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '@images/BookHuntLogoSmall.png';

/**
 * AuthBrand — the brand lockup above the Login and Register cards.
 *
 * Replaces the old `.site-title` <h1>, which put the logo <img> inline
 * after the wordmark text. Tailwind's preflight renders <img> as a
 * block element, so the logo dropped onto its own line at the far-left
 * edge of the page while the wordmark centered alone — and the
 * wordmark was set in Playfair Display while every other brand lockup
 * in the app (PageBrand on the internal pages) uses Plus Jakarta Sans.
 * This lockup is a single centered flex row — logo and wordmark always
 * travel together — in the same Jakarta bold style as PageBrand.
 * (Playfair stays reserved for page titles like "Register"/"Welcome".)
 *
 * U1.1: the lockup is a Home button, like every other brand in the app
 * (Juan's rule: the logo is always visible and always links home). It
 * navigates to /search; a signed-out visitor is bounced straight back
 * to /login by the Protected route, and a signed-in one lands on Book
 * Search.
 */
const AuthBrand = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center px-4 mt-12 mb-10">
            <button
                type="button"
                onClick={() => navigate('/search')}
                aria-label="Home — Book Search"
                className="flex items-center justify-center gap-3 bg-transparent border-0 cursor-pointer px-3 py-2 rounded-full transition-colors hover:bg-pio-coral-pale/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
            >
                <img
                    src={logo}
                    alt="BookHunt logo"
                    style={{ width: '44px', height: '44px', display: 'block' }}
                />
                <span className="m-0 text-pio-text font-jakarta font-bold text-[1.7rem] leading-none">
                    Book Hunt
                </span>
            </button>
        </div>
    );
};

export default AuthBrand;
