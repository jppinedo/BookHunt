import React from "react";
import logo from '@assets/bookhunt-logo.svg';

/**
 * BrandLockup — U15: the ONE brand lockup for the whole app.
 *
 * Juan's review of the U14 preview: many pages had no logo on top at
 * all (on desktop the U10 rail retired the header brand entirely, so
 * only the rail's icon remained), and he wants the logo ALWAYS
 * present — even alongside the rail. The settled shape: the SVG mark
 * with "Book Hunt" as HTML text on its RIGHT — a compact horizontal
 * lockup, much smaller than the home hero lockup — at the top of
 * the page.
 *
 * U16 (Juan's review of U15): centered read as lost in the wide
 * shell, so the lockup now sits at the LEFT edge of the page's
 * content column (the alignment lives in the callers' wrappers),
 * and it grows a step — mark 34px → 44px, wordmark text-lg →
 * text-2xl — so it carries the header on its own.
 *
 * Every surface renders this same component so the lockup can never
 * drift apart again: PageBrand in the app shell (every logged-in
 * page), AuthBrand (Login / Register / Reset Password), and the
 * SearchPage results view (where it replaces the big hero lockup
 * once results exist; the hero state keeps the large centered logo).
 *
 * Behavior is the caller's: every caller wires the U7 homecoming —
 * SearchContext.resetSearch + navigate to /search — so the logo
 * always lands on the clean home view (empty bar, no results), never
 * the preserved session. The aria-label defaults to the shell
 * lockup's "Book Hunt — home"; AuthBrand passes its own.
 */
const BrandLockup = ({ onClick, ariaLabel = 'Book Hunt — home' }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="flex items-center justify-center gap-3 bg-transparent border-0 cursor-pointer px-2.5 py-1.5 -ml-2.5 rounded-full transition-colors hover:bg-pio-coral-pale/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
    >
        <img
            src={logo}
            alt=""
            style={{ width: '44px', height: '44px', display: 'block' }}
        />
        <span className="text-pio-text text-2xl font-bold font-jakarta leading-none">
            Book Hunt
        </span>
    </button>
);

export default BrandLockup;
