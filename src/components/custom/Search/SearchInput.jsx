import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, X as ClearIcon } from 'react-feather';

/**
 * SearchInput — D2 rebuild, following the structure of Juan's reference
 * screenshot (NOT its colors):
 *
 *   [ magnifier icon ]  placeholder text            [ Search ]
 *   └────────────── one fully-rounded pill field ─────────────┘
 *
 * - Field: white, fully rounded, warm hairline border (pio-grid) and a
 *   soft Lienzo shadow; 56px tall on desktop, 52px on phones.
 * - The Search button is a solid CORAL pill sitting INSIDE the field,
 *   inset 5px from the field's edge (46px / 42px tall) — not a separate
 *   button beside the field.
 * - Icon: muted teal-gray (pio-teal-dark-muted), the reference's muted
 *   left icon in Lienzo's palette.
 * - Focus: the whole field takes a coral border + soft coral ring
 *   (focus-within), so the focus state belongs to the pill as a unit.
 *
 * Why not Lienzo Input + Button inside a form (the previous build)?
 * Lienzo Input is a fixed-48px field with its own gray fill and border;
 * nesting it produced a gray box inside a white box, and Lienzo Button
 * has no coral-pill-at-inset sizing. The pill is a single composite
 * control, so it is built here from native elements styled with Lienzo
 * tokens (the same pattern as the custom HubNav). The <form> submit is
 * the only search trigger — the old code also fired onSearch from the
 * button's onClick, double-navigating on every search.
 */
const SearchInput = ({
    onSearch,
    onClear,
    inputValue,
    className
}) => {
  const [query, setQuery] = useState(inputValue || '');
  const inputRef = useRef(null);

  // Keep the field in sync when the URL query changes (e.g. /search?query=…)
  useEffect(() => {
    setQuery(inputValue || '');
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  // U7: when the page passes onClear, the X is a full reset to the
  // clean home view (Juan: clicking X should land on home with no
  // results, from any page with this bar) — the page owns that
  // navigation + session wipe. Without onClear it stays the original
  // local text clear.
  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className={`w-full max-w-[640px] mx-auto px-3 ${className || ''}`}>
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Find by title or ISBN"
        className="flex items-center h-[52px] sm:h-14 rounded-full bg-white border border-pio-grid pl-5 pr-[5px] shadow-pio-soft transition-[border-color,box-shadow] duration-200 hover:shadow-pio-card focus-within:border-pio-coral focus-within:ring-4 focus-within:ring-pio-coral/15"
      >
        <SearchIcon size={20} aria-hidden="true" className="shrink-0 text-pio-teal-dark-muted" />
        <input
          ref={inputRef}
          type="text"
          enterKeyHint="search"
          autoComplete="off"
          aria-label="Search by title or ISBN"
          placeholder="Search by title or ISBN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none px-3 text-base text-pio-text placeholder:text-pio-text-muted"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 flex items-center justify-center w-8 h-8 mr-1 rounded-full border-0 bg-transparent text-pio-text-muted cursor-pointer transition-colors hover:text-pio-text hover:bg-pio-bg-light"
          >
            <ClearIcon size={16} aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="submit"
          className="shrink-0 h-[42px] sm:h-[46px] px-5 sm:px-7 rounded-full bg-pio-coral text-white text-[15px] font-semibold border-0 cursor-pointer transition-colors hover:bg-pio-coral-hover active:bg-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral-dark"
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchInput;
