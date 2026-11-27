import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'react-feather';

/**
 * BreadcrumbNav — U1.1: replaces the standalone BackButton from U1.
 *
 * Juan's verdict on U1: a lone coral "‹ Back" floating above the search
 * bar read as a stray link, not navigation — and the deals screen had no
 * brand header at all. His fix, implemented here: one slim breadcrumb
 * bar that sits under the page header (and under the search bar on the
 * pages that lead with one), holding BOTH the Back action and a
 * clickable trail of where the user is:
 *
 *   ‹ Back   Home › Results › Clean Code
 *
 * - Back keeps the U1 history logic: navigate(-1) retraces the user's
 *   actual path through the MemoryRouter session stack; the initial
 *   entry carries the key "default", and if this screen IS that entry
 *   there is nothing to go back to, so it replace-navigates to the
 *   per-screen `fallback` instead.
 * - Intermediate crumbs are links (coral, Lienzo's interactive color);
 *   the last crumb is the current page — plain semibold text with
 *   aria-current, never a link. A crumb may carry an onClick instead of
 *   a `to` (Profile used this to switch its own tabs until U9 split
 *   My Listings into its own page; the mechanism stays available).
 * - Long titles truncate with ellipsis so the bar always stays on one
 *   line; every target is ≥44px tall, per the app's touch rules.
 *
 * crumbs: [{ label, to?, onClick?, current? }] — the final crumb is
 * treated as current even without the flag.
 *
 * U1.2: `end` is an optional right-aligned slot (ml-auto) — the search
 * results page puts its result count there ("20 results for …"), so the
 * count lives in the bar instead of floating as a separate line above
 * the grid. Other pages pass nothing and the bar stays clean.
 * U7: the "Home" crumb is a link WITH an onClick — pages pass
 * SearchContext.resetSearch there, so Home lands on the clean home
 * view (empty bar, no results), while Back and the "Results" crumb
 * keep the U1 preserved-session behavior. The component just renders
 * what it's given; the distinction lives in the pages' crumb defs.
 * The Back button was also restyled: in U1.1 it was bare coral text at a
 * larger size than the crumbs, so it read as a stray link, not a
 * button. It is now a pill at the SAME text-sm size as the crumbs, with
 * a coral border and a light coral tint that deepens on hover.
 *
 * U11: the full bar doesn't fit a phone — Juan's screenshot showed the
 * trail truncating to single letters ("H › F") with the result count
 * jammed against it. Under 640px the bar therefore shows only the Back
 * pill and the CURRENT crumb (intermediate crumbs are hidden — Back,
 * the logo and the bottom nav already cover those jumps on mobile),
 * and the `end` slot wraps onto its own line directly below the bar,
 * right-aligned, via flex-wrap + a full-width basis on the slot. At
 * 640px and up nothing changes: full trail, end slot inside the bar.
 * The props/API are unchanged, so every page inherits the treatment.
 */
const BreadcrumbNav = ({ crumbs = [], fallback = '/search', className = '', end = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };

  const linkClasses =
    'inline-flex items-center min-h-[44px] px-1.5 rounded-md font-jakarta text-sm font-medium text-pio-coral no-underline transition-colors hover:text-pio-coral-dark hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral';

  const renderCrumb = (crumb, index) => {
    const isCurrent = crumb.current || index === crumbs.length - 1;
    const label = <span className="truncate">{crumb.label}</span>;

    if (isCurrent) {
      return (
        <span
          aria-current="page"
          className="inline-flex items-center min-h-[44px] px-1 font-jakarta text-sm font-semibold text-pio-text min-w-0 max-w-[62vw] sm:max-w-[300px]"
        >
          {label}
        </span>
      );
    }
    if (crumb.to) {
      return (
        <Link
          to={crumb.to}
          onClick={crumb.onClick}
          className={`${linkClasses} min-w-0 max-w-[30vw] sm:max-w-[200px]`}
        >
          {label}
        </Link>
      );
    }
    if (crumb.onClick) {
      return (
        <button
          type="button"
          onClick={crumb.onClick}
          className={`${linkClasses} bg-transparent border-0 cursor-pointer min-w-0 max-w-[30vw] sm:max-w-[200px]`}
        >
          {label}
        </button>
      );
    }
    return (
      <span className="inline-flex items-center min-h-[44px] px-1 font-jakarta text-sm text-pio-text-muted min-w-0 max-w-[30vw] sm:max-w-[200px]">
        {label}
      </span>
    );
  };

  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1 font-jakarta ${className}`}>
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="inline-flex items-center gap-0.5 min-h-[40px] my-[2px] pl-2 pr-3.5 rounded-full bg-pio-coral-pale/50 border border-solid border-pio-coral cursor-pointer font-jakarta text-sm font-semibold text-pio-coral-dark shrink-0 transition-colors hover:bg-pio-coral-opacity-20 hover:border-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
      >
        <ChevronLeft size={18} aria-hidden="true" className="shrink-0" />
        Back
      </button>
      {crumbs.length > 0 && (
        <ol className="flex items-center m-0 p-0 list-none min-w-0">
          {crumbs.map((crumb, index) => {
            // U11: under 640px only the current crumb survives — the
            // intermediate <li>s hide, and so does the separator in
            // front of the current crumb (it would dangle after Back).
            const isCurrentCrumb = crumb.current || index === crumbs.length - 1;
            return (
              <li
                key={`${crumb.label}-${index}`}
                className={isCurrentCrumb ? 'flex items-center min-w-0' : 'hidden sm:flex items-center min-w-0'}
              >
                {index > 0 && (
                  <ChevronRight size={14} aria-hidden="true" className="text-pio-text-muted shrink-0 mx-0.5 hidden sm:block" />
                )}
                {renderCrumb(crumb, index)}
              </li>
            );
          })}
        </ol>
      )}
      {end ? (
        <span className="ml-auto shrink-0 pl-3 inline-flex items-center min-h-[44px] font-jakarta text-xs sm:text-[13px] text-pio-text-muted whitespace-nowrap max-sm:basis-full max-sm:justify-end max-sm:pl-0">
          {end}
        </span>
      ) : null}
    </nav>
  );
};

export default BreadcrumbNav;
