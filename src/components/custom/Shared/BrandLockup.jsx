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
 * page) and the SearchPage results view (where it replaces the big
 * hero lockup once results exist; the hero state keeps the large
 * centered logo). The auth screens used to render it too, but U21
 * moved them to the stacked hero lockup below.
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

/**
 * StackedBrandLockup — U21: the HOME HERO lockup as a reusable
 * component: the large mark (56px under 640px, 92px above) with
 * "Book Hunt" as HTML text BELOW it, the whole lockup centered.
 *
 * Juan's review of the U20 preview: the Login / Register screens
 * should carry the big hero treatment, not the small horizontal
 * lockup — so AuthBrand renders this on Login, Register and Reset
 * Password. The markup and classes mirror the SearchPage hero
 * lockup (same mark sizes, same Jakarta-bold wordmark at 22px →
 * sm:text-4xl under the mark, same gap); only the hero's
 * page-specific outer margins are left to the caller. SearchPage
 * keeps its own inline copy of the hero — this component does not
 * replace it. Behavior is the caller's, same contract as
 * BrandLockup: the U7 homecoming click.
 */
export const StackedBrandLockup = ({ onClick, ariaLabel = 'Book Hunt — home' }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="block mx-auto bg-transparent border-0 p-0 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pio-coral"
    >
        <span className="flex flex-col items-center">
            <img src={logo} alt="" className="w-[56px] sm:w-[92px] h-auto" style={{ display: 'block' }} />
            <span className="font-jakarta font-bold text-pio-text tracking-tight leading-none text-[22px] sm:text-4xl mt-1.5 sm:mt-2">
                Book Hunt
            </span>
        </span>
    </button>
);

export default BrandLockup;
