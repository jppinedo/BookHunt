import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, X as ClearIcon } from 'react-feather';

/**
 * CompactSearch — U15: a miniature of the D2 search pill, built for
 * the search results page. Juan's Stitch reference puts a small
 * search field at the right side of the breadcrumb bar on the
 * results view — clean, and it keeps re-searching one tap away
 * without the hero-sized pill dominating a page whose job is the
 * list. It lives in BreadcrumbNav's `end` slot (which also evicts
 * the result count from the bar — the count moved to the title row
 * under the bar; see SearchPage).
 *
 * Same anatomy as SearchInput, scaled down: one fully-rounded white
 * pill (~38px tall), muted magnifier at the left, a clear (×) when
 * text is present, and a small solid coral "Search" pill inset at
 * the right; the whole field takes the coral focus ring. The <form>
 * submit is the only search trigger (same double-fire lesson as
 * D2). On phones the breadcrumb bar hides (U11.1) and the `end`
 * slot renders as its own full-width row — the form stretches to
 * fill it (w-full below sm, fixed 290px in the bar at sm+).
 *
 * Behavior is the page's, exactly like SearchInput: onSearch runs
 * the search flow; onClear is the U7 full reset to the clean home
 * view when the page passes it.
 */
const CompactSearch = ({ onSearch, onClear, inputValue }) => {
  const [query, setQuery] = useState(inputValue || '');
  const inputRef = useRef(null);

  // Keep the field in sync when the session query changes (e.g. a
  // fresh search navigates to /search?query=…).
  useEffect(() => {
    setQuery(inputValue || '');
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Find by title or ISBN"
      className="flex items-center h-[38px] w-full sm:w-[290px] rounded-full bg-white border border-pio-grid pl-3.5 pr-[4px] shadow-pio-soft transition-[border-color,box-shadow] duration-200 hover:shadow-pio-card focus-within:border-pio-coral focus-within:ring-4 focus-within:ring-pio-coral/15"
    >
      <SearchIcon size={16} aria-hidden="true" className="shrink-0 text-pio-teal-dark-muted" />
      <input
        ref={inputRef}
        type="text"
        enterKeyHint="search"
        autoComplete="off"
        aria-label="Search by title or ISBN"
        placeholder="Search by title or ISBN"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none px-2.5 text-sm text-pio-text placeholder:text-pio-text-muted"
      />
      {query ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="shrink-0 flex items-center justify-center w-6 h-6 mr-0.5 rounded-full border-0 bg-transparent text-pio-text-muted cursor-pointer transition-colors hover:text-pio-text hover:bg-pio-bg-light"
        >
          <ClearIcon size={14} aria-hidden="true" />
        </button>
      ) : null}
      <button
        type="submit"
        className="shrink-0 h-[30px] px-3.5 rounded-full bg-pio-coral text-white text-[13px] font-semibold border-0 cursor-pointer transition-colors hover:bg-pio-coral-hover active:bg-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral-dark"
      >
        Search
      </button>
    </form>
  );
};

export default CompactSearch;
