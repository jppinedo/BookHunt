import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { SearchContext } from '@state/SearchContext';
import SearchInput from '@custom/Search/SearchInput';
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import BookResults from '@custom/Search/BookResults';
import InfoBox from '@custom/Shared/InfoBox';
import { BookOpen as MenuBookIcon } from 'react-feather';
import LoadingResults from '@custom/Search/LoadingResults';
import logo from '@assets/bookhunt-logo.svg';

// This preview runs on a small built-in catalog (mock data, no live Google
// Books key), so only these titles can match. They are offered as one-tap
// example searches — and as the recovery path when a search finds nothing.
const EXAMPLE_SEARCHES = [
  'clean code',
  'design patterns',
  'refactoring',
  'algorithms',
  "don't make me think",
];

const ExampleSearches = ({ onPick }) => (
  <div className="flex flex-wrap items-center justify-center gap-2 mt-5 px-2">
    <span className="text-[13px] font-semibold text-pio-text-muted mr-0.5">Try:</span>
    {EXAMPLE_SEARCHES.map((term) => (
      <button
        key={term}
        type="button"
        onClick={() => onPick(term)}
        className="bg-white text-pio-text border border-pio-grid shadow-sm rounded-full px-3.5 py-1.5 text-[13.5px] font-medium cursor-pointer transition-colors hover:border-pio-coral hover:bg-pio-coral-pale/40 hover:text-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
      >
        {term}
      </button>
    ))}
  </div>
);

const SearchPage = () => {
  // U1: search state (books / status / searchedQuery) is owned by
  // SearchContext at App level, not by this page — the page unmounts when
  // the user drills into a book, and the session must survive that.
  const { books, status, searchedQuery, runSearch, resetSearch } = useContext(SearchContext);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('query');

  const navigate = useNavigate();

  const handleItemClick = (book) => {
    const params = {
      isbn: book.isbn,
      title: book.title ? encodeURIComponent(book.title) : null,
      year: book.year,
      author: book.authors && book.authors.length > 0 ? book.authors[0] : null,
    };

    const query = Object.entries(params)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    console.log(query);
    navigate(`/results?${query}`);
  }

  const setQueryParam = (query) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  }

  // Search only when the URL asks for something the session doesn't
  // already hold. Returning here (Back from a book's deals, the Home
  // button, the bottom nav) with the same — or no — query re-renders the
  // preserved results instead of wiping them and searching again. The old
  // code reset the page on every bare /search visit, which is exactly
  // what threw the user's results away.
  useEffect(() => {
    if (urlQuery?.length && urlQuery !== searchedQuery) {
      runSearch(urlQuery);
    }
  }, [urlQuery, searchedQuery, runSearch])

  const isLoading = status === 'loading';
  const showNoResults = status === 'done' && !books.length && searchedQuery;
  // Home state (nothing to show yet — idle, loading, or no matches):
  // logo + search sit vertically centered in the viewport. Once results
  // exist the page switches to normal top-aligned flow so the grid can
  // grow downward. The min-height leaves room for the floating hub nav.
  const isHomeState = !books.length;

  return (
    <div
      className={isHomeState ? 'flex flex-col justify-center box-border' : undefined}
      style={isHomeState ? { minHeight: 'calc(100dvh - 5.5rem)', paddingBottom: '4.5rem' } : undefined}
    >
      {/* U1.1: this page has no PageBrand header — its hero logo IS the
          brand lockup, so the logo itself is the Home button (Juan's
          rule: the logo is always visible and always links home).
          U7: Home means the CLEAN home view — the click resets the
          search session (and drops any ?query=) instead of landing on
          the preserved results. The logo also gets real margin below
          it (0.5rem → 1.5rem): it sat almost on top of the search
          bar/headline under it.
          U11: on phones the 168px lockup ate a huge share of the
          screen, so the logo steps down to 100px under 640px (the
          1.5rem margin below it is unchanged).
          U13: the old hero PNG had the "Book Hunt" wordmark baked
          into the image. The lockup is now the new SVG mark with the
          wordmark as real HTML text under it (same Jakarta bold as
          PageBrand/AuthBrand), sized so the whole lockup keeps
          roughly the old footprint and the same step-down under
          640px. The reset click covers the whole lockup. */}
      <button
        type="button"
        onClick={() => { resetSearch(); navigate('/search', { replace: true }); }}
        aria-label="Book Hunt — home"
        className="block mx-auto bg-transparent border-0 p-0 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pio-coral"
      >
        <span className="flex flex-col items-center">
          <img src={logo} alt="" className="w-[56px] sm:w-[92px] h-auto" style={{display: 'block', margin: '1rem auto 0'}} />
          <span
            className="font-jakarta font-bold text-pio-text tracking-tight leading-none text-[22px] sm:text-4xl mt-1.5 sm:mt-2"
            style={{marginBottom: '1.5rem'}}
          >
            Book Hunt
          </span>
        </span>
      </button>
      {/* D2 hero: in the idle home state the logo gets a headline and a
          one-line promise, so the centered hero reads as a composed
          unit (logo → headline → subline → pill search → example
          chips) on the 8pt rhythm instead of a logo floating over a
          hint line. The InfoBox hint still serves the results and
          no-results states below. */}
      {status === 'idle' ? (
        <div className="px-4">
          <h1 className="font-playfair text-pio-text text-[28px] sm:text-4xl font-semibold leading-tight mt-2 mb-2.5">
            Find your next book for less.
          </h1>
          <p className="text-pio-text-muted text-[15px] sm:text-base max-w-[520px] mx-auto mt-0 mb-7">
            One search across campus listings and marketplace deals.
          </p>
        </div>
      ) : null}

      {/* U7: the X resets to the clean home view (session wiped, bare
          /search), same as the logo and the Home crumb. */}
      <SearchInput
        onSearch={setQueryParam}
        onClear={() => { resetSearch(); navigate('/search', { replace: true }); }}
        inputValue={urlQuery || searchedQuery || ''}
      />

      {/* U1.2 order (Juan's screenshot review): search input → hint →
          breadcrumb bar → results grid. The hint sits directly below
          the search input; the breadcrumb bar below the hint. All three
          blocks live in the shared .page-shell so their edges align
          with the grid's. */}
      {books.length ? (
        <div className="page-shell">
          <InfoBox icon={MenuBookIcon} content="Click on a book to start finding deals!" />
        </div>
      ) : null}

      {/* U1.1: once a search session exists, the breadcrumb bar carries
          the same navigation as every inner page (Home / Results).
          U1.2: the result count moved INTO the bar's right end — it
          used to be a separate line above the grid. */}
      {status !== 'idle' ? (
        <div className="page-shell">
          <BreadcrumbNav
            crumbs={[
              { label: 'Home', to: '/search', onClick: resetSearch },
              { label: 'Results', current: true },
            ]}
            fallback="/search"
            end={status === 'done' && books.length ? (
              <>
                <span className="font-semibold text-pio-text">
                  {books.length} {books.length === 1 ? 'result' : 'results'}
                </span>
                &nbsp;for &ldquo;{searchedQuery}&rdquo;
              </>
            ) : null}
          />
        </div>
      ) : null}

      {status === 'idle' ? (
        <ExampleSearches onPick={setQueryParam} />
      ) : null}

      {isLoading ? (
        <LoadingResults className="mt-8" />
      ) : showNoResults ? (
        <>
          <InfoBox
            icon={MenuBookIcon}
            content={`No matches for "${searchedQuery}" in this preview's built-in catalog. Try one of these instead:`}
          />
          <ExampleSearches onPick={setQueryParam} />
        </>
      ) : (
        <BookResults books={books} onClickItem={handleItemClick} />
      )}

    </div>
  );
};


export default SearchPage;
