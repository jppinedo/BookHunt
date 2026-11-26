import React from "react";
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
 */
const AuthBrand = () => (
    <div className="flex items-center justify-center gap-3 px-4 mt-12 mb-10">
        <img
            src={logo}
            alt="BookHunt logo"
            style={{ width: '44px', height: '44px', display: 'block' }}
        />
        <h1 className="m-0 text-pio-text font-jakarta font-bold text-[1.7rem] leading-none">
            Book Hunt
        </h1>
    </div>
);

export default AuthBrand;
