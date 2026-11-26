import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { SearchContext } from '@state/SearchContext';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';
import InfoBox from '@custom/Shared/InfoBox';
import { BookOpen as MenuBookIcon } from 'react-feather';
import LoadingResults from '@custom/Search/LoadingResults';
import logo from '@assets/images/book_hunt_logo.png';

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
  const { books, status, searchedQuery, runSearch } = useContext(SearchContext);
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
      <img src={logo} alt="Book Hunt" style={{display: 'block', width: '168px', height: 'auto', margin: '0.75rem auto 0.5rem'}} />
      {/* D2 hero: in the idle home state the logo gets a headline and a
          one-line promise, so the centered hero reads as a composed
          unit (logo → headline → subline → pill search → example
          chips) on the 8pt rhythm instead of a logo floating over a
          hint line. The InfoBox hint still serves the results and
          no-results states below. */}
      {status === 'idle' ? (
        <div className="px-4">
          <h1 className="font-playfair text-pio-text text-[30px] sm:text-4xl font-semibold leading-tight mt-2 mb-2.5">
            Find your next book for less.
          </h1>
          <p className="text-pio-text-muted text-[15px] sm:text-base max-w-[520px] mx-auto mt-0 mb-7">
            One search across campus listings and marketplace deals.
          </p>
        </div>
      ) : null}

      <SearchInput onSearch={setQueryParam} inputValue={urlQuery || searchedQuery || ''}/>

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
        <>
        {books.length ? (
          <InfoBox icon={MenuBookIcon} content="Click on a book to start finding deals!" />
        ) : null}

        <BookResults books={books} onClickItem={handleItemClick} query={searchedQuery} />
        </>
      )}

    </div>
  );
};


export default SearchPage;
