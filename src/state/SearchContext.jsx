import React, { createContext, useCallback, useState } from 'react';
import { searchGoogleBooks } from '@services/GoogleAPI';

export const SearchContext = createContext();

/**
 * SearchProvider — U1: the Google Books search session lives here, at App
 * level, instead of in SearchPage's local state. SearchPage unmounts when
 * the user drills into a book's deals (/results) or a listing detail
 * (/book/…), which used to throw the query and its results away: coming
 * back meant an empty home and a fresh search. With the state lifted here,
 * returning to /search shows the previous query and results instantly,
 * with no re-search.
 *
 * Also remembers the last deals (/results?…) URL visited, so the detail
 * screen's Back button has a sensible fallback destination ("deals for
 * that book") on the rare entry that has no in-app history behind it.
 */
export const SearchProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'done'
  const [searchedQuery, setSearchedQuery] = useState('');
  const [lastDealsUrl, setLastDealsUrl] = useState(null);

  const runSearch = useCallback(async (query) => {
    setStatus('loading');
    try {
      const results = await searchGoogleBooks(query);
      setBooks(results);
      setSearchedQuery(query);
    } catch (err) {
      console.error('Search failed:', err);
      setBooks([]);
      setSearchedQuery(query);
    } finally {
      setStatus('done');
    }
  }, []);

  // U7: Home means a CLEAN start (Juan's review of the full UX preview):
  // the breadcrumb "Home" crumb, the brand logo, and the search field's
  // X button all wipe the preserved session — empty query, no results,
  // status back to idle, no remembered deals URL — so /search renders
  // the fresh home view. This is deliberately separate from Back and
  // the "Results" crumb, which keep the U1 behavior of returning to the
  // preserved results.
  const resetSearch = useCallback(() => {
    setBooks([]);
    setStatus('idle');
    setSearchedQuery('');
    setLastDealsUrl(null);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        books,
        status,
        searchedQuery,
        runSearch,
        resetSearch,
        lastDealsUrl,
        setLastDealsUrl,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
