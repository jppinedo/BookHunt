import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';

/**
 * BackButton — U1: one consistent Back control for the deeper screens
 * (deals list, listing detail, Sell Book). Before U1 those screens had no
 * way back at all: the only escapes were the logo / bottom nav, which dump
 * the user on an empty Home and throw away the flow they were in.
 *
 * Behaviour: go back one entry in the router history (MemoryRouter keeps
 * a real in-session history stack, so navigate(-1) retraces the user's
 * actual path: detail → deals → results). The initial entry of a memory
 * history carries the key "default"; if this screen somehow IS that entry
 * there is nothing to go back to, so we replace-navigate to `fallback`
 * instead (each screen passes its own sensible parent destination).
 *
 * Styling follows the app's D1/D2 language: coral accent text on the warm
 * paper surface, Jakarta semibold, a 44px minimum touch target, and the
 * same focus ring treatment as the search pill and example chips.
 */
const BackButton = ({ fallback = '/search', className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back"
      className={`inline-flex items-center gap-0.5 min-h-[44px] pl-1.5 pr-3.5 -ml-1.5 rounded-full bg-transparent border-0 cursor-pointer font-jakarta text-[15px] font-semibold text-pio-coral transition-colors hover:bg-pio-coral-pale/40 hover:text-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral ${className}`}
    >
      <ChevronLeft size={22} aria-hidden="true" className="shrink-0" />
      Back
    </button>
  );
};

export default BackButton;
