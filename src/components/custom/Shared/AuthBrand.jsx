import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from '@state/SearchContext';
import BrandLockup from '@custom/Shared/BrandLockup';

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
 * U15: the lockup itself is now the shared BrandLockup — the same
 * compact horizontal mark + wordmark that tops every logged-in
 * page — so the auth screens carry the identical brand. Only the
 * generous top/bottom spacing around it is auth-specific (the
 * cards sit lower on the page than app content). The click also
 * takes the U7 homecoming now (resetSearch before navigating),
 * like every other instance of the lockup.
 *
 * U16: like PageBrand, the lockup is LEFT-aligned now — the
 * wrapper takes the exact box of the auth card under it (Login /
 * Reset: max-w-[24em] centered; Register passes `wide` for its
 * 26rem card), so the mark sits flush with the card's left edge
 * instead of floating centered above it.
 */
const AuthBrand = ({ wide = false }) => {
    const navigate = useNavigate();
    const { resetSearch } = useContext(SearchContext);
    return (
        <div className={`flex mt-12 mb-10 mx-auto ${wide ? 'max-w-[26rem] w-[calc(100%-2rem)]' : 'max-w-[24em] w-full'}`}>
            <BrandLockup
                ariaLabel="Home — Book Search"
                onClick={() => { resetSearch(); navigate('/search'); }}
            />
        </div>
    );
};

export default AuthBrand;
