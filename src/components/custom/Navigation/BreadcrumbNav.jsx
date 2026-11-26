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
 *   a `to` (Profile uses this to switch its own tabs).
 * - Long titles truncate with ellipsis so the bar always stays on one
 *   line; every target is ≥44px tall, per the app's touch rules.
 *
 * crumbs: [{ label, to?, onClick?, current? }] — the final crumb is
 * treated as current even without the flag.
 */
const BreadcrumbNav = ({ crumbs = [], fallback = '/search', className = '' }) => {
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
          className="inline-flex items-center min-h-[44px] px-1 font-jakarta text-sm font-semibold text-pio-text min-w-0 max-w-[46vw] sm:max-w-[300px]"
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
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 font-jakarta ${className}`}>
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="inline-flex items-center gap-0.5 min-h-[44px] pl-1.5 pr-3 -ml-1.5 rounded-full bg-transparent border-0 cursor-pointer font-jakarta text-[15px] font-semibold text-pio-coral shrink-0 transition-colors hover:bg-pio-coral-pale/40 hover:text-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
      >
        <ChevronLeft size={22} aria-hidden="true" className="shrink-0" />
        Back
      </button>
      {crumbs.length > 0 && (
        <ol className="flex items-center m-0 p-0 list-none min-w-0">
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center min-w-0">
              {index > 0 && (
                <ChevronRight size={14} aria-hidden="true" className="text-pio-text-muted shrink-0 mx-0.5" />
              )}
              {renderCrumb(crumb, index)}
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};

export default BreadcrumbNav;
