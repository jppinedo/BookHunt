import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from '@state/SearchContext';
import { StackedBrandLockup } from '@custom/Shared/BrandLockup';

/**
 * AuthBrand — the brand lockup above the Login, Register and Reset
 * Password cards.
 *
 * Replaces the old `.site-title` <h1>, which put the logo <img> inline
 * after the wordmark text. Tailwind's preflight renders <img> as a
 * block element, so the logo dropped onto its own line at the far-left
 * edge of the page while the wordmark centered alone — and the
 * wordmark was set in Playfair Display while every other brand lockup
 * in the app uses Plus Jakarta Sans. (Playfair stays reserved for
 * page titles like "Register"/"Welcome".)
 *
 * U1.1: the lockup is a Home button, like every other brand in the app
 * (Juan's rule: the logo is always visible and always links home). It
 * navigates to /search; a signed-out visitor is bounced straight back
 * to /login by the Protected route, and a signed-in one lands on Book
 * Search.
 *
 * U15: the lockup became the shared BrandLockup — the same compact
 * horizontal mark + wordmark that tops every logged-in page. U16
 * then left-aligned it to the auth card's box.
 *
 * U21 (Juan's review of the U20 preview): the auth screens go back
 * to being special — they get the HOME HERO treatment instead: the
 * StackedBrandLockup, the large mark with "Book Hunt" as HTML text
 * below it, the whole lockup centered above the card. The click
 * keeps the U7 homecoming (resetSearch before navigating) and the
 * same aria-label. Only the generous top/bottom spacing around it
 * is auth-specific (the cards sit lower on the page than app
 * content). The logged-in pages keep the U16 small left-aligned
 * horizontal lockup — untouched by this change.
 */
const AuthBrand = () => {
    const navigate = useNavigate();
    const { resetSearch } = useContext(SearchContext);
    return (
        <div className="flex justify-center mt-12 mb-10">
            <StackedBrandLockup
                ariaLabel="Home — Book Search"
                onClick={() => { resetSearch(); navigate('/search'); }}
            />
        </div>
    );
};

export default AuthBrand;
