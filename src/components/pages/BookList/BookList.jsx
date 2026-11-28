
import React, {useContext, useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { SearchContext } from '@state/SearchContext';
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import { searchEbay } from "@services/EbayAPI";
import { searchBookInDB } from "@services/BookFirestore";
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatEbayBook } from '@utils/search-utils';
import { MapPin, Tag } from 'react-feather';
import { Spinner } from "@jppinedo/lienzo";
import BookCard from "@custom/Books/BookCard";
import LoadingResults from "@custom/Search/LoadingResults";
import CompactSearch from "@custom/Search/CompactSearch";

/** BookList — MUI Container/Backdrop/CircularProgress replaced by a Tailwind
 *  container div and a Lienzo Spinner overlay (Backdrop is a Phase 2 gap;
 *  same custom-overlay pattern as ErrorModal). */
const BookList = () => {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryCompleted, setQueryCompleted] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const limit = 20; // Number of items to fetch per request

  const [searchParams] = useSearchParams();
  const isbn = searchParams.get('isbn');
  const title = searchParams.get('title');
  const year = searchParams.get('year');
  const author = searchParams.get('author');

  const params = { isbn, title, year, author };
  const query = Object.entries(params)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${key}:${value}`)
    .join('+');

  // U1: remember this deals URL so the listing detail screen's
  // breadcrumb can fall back to "deals for this book", and give this
  // screen's own Back a fallback: the preserved Google results for the
  // book's title (normally Back just retraces history to them).
  const location = useLocation();
  const { setLastDealsUrl, resetSearch } = useContext(SearchContext);
  useEffect(() => {
    setLastDealsUrl(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search, setLastDealsUrl]);
  const backFallback = title ? `/search?query=${encodeURIComponent(title)}` : '/search';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ebayData, bdData] = await Promise.all([
          searchEbay(query, limit, offset),
          searchBookInDB(params)
        ]);

        if(ebayData?.itemSummaries?.length || bdData.length) {
          const formatedEbayResults = ebayData.itemSummaries.map(item => formatEbayBook(item));
          setResults([...bdData, ...formatedEbayResults]);
          setOffset(offset + limit);
          setHasMore(formatedEbayResults.length === limit); // Check if there are more results
        } else setResults([]);

      } catch (err) {
        setError(err.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
        setQueryCompleted(true);
      }
    };

    if (query && !queryCompleted) {
      fetchResults();
    }
  }, [loading, query, queryCompleted]);

  const fetchMoreResults = async () => {
    console.log('hasMore: ', hasMore)
    console.log('loading: ', loading)
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const ebayData = await searchEbay(query, limit, offset);
      const formatedEbayResults = ebayData.itemSummaries.map(item => formatEbayBook(item));
      setResults((prevItems) => [...prevItems, ...formatedEbayResults]);
      setOffset(offset + limit);
      setHasMore(formatedEbayResults.length === limit);
    } catch (error) {
      console.error('Error fetching more results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (item) => {
    navigate(`/book/${item.sellerType}/${item.id}`);
  }

  const handleSearch = (query) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  }

  // U3: also covers the first paint before the fetch effect flips
  // `loading` — the sections below would otherwise flash "· 0" counts
  // and empty notes for a frame now that they render the empty state.
  if ((loading || query) && !queryCompleted) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40">
         <Spinner size="48px" thickness="6px" />
      </div>
    );
  }

  // U1.1: the breadcrumb trail for the deals screen. "Results" lands
  // on /search, which since U1 restores the preserved Google Books
  // session — the results the user drilled in from. U7: "Home" is a
  // different promise — it resets the session first, so it lands on
  // the clean home view (empty bar, no results).
  const crumbs = [
    { label: 'Home', to: '/search', onClick: resetSearch },
    { label: 'Results', to: '/search' },
    { label: title || 'Deals', current: true },
  ];

  // U3: the two sources are no longer one merged card stream. Campus
  // listings (Supabase/user rows — the marketplace's whole point) come
  // first under their own heading; eBay deals follow under theirs.
  // The campus heading carries its count (U8: the eBay heading no
  // longer does — its results load progressively), and a source with
  // nothing to show
  // gets a one-line note instead of the old generic "No more results
  // found." card (which also used to be the whole screen when both
  // sources came back empty).
  const campusListings = results.filter((item) => item.sellerType !== 'eBay');
  const ebayListings = results.filter((item) => item.sellerType === 'eBay');

  // U7: the sections use the shared .card-grid (index.css) —
  // full-width cells filled from the left, equal-height rows —
  // replacing the centered flex wrap whose shrink-wrapped cards made
  // the list narrower than the breadcrumb bar above it. U8: the same
  // rule now standardizes every item list at 1/2/3 columns.
  const renderCard = (item, index) => (
    <BookCard
      key={`${item.sellerType}-${item.id}-${index}`}
      book={item}
      type="grid"
      onCardClick={handleBookClick}
    />
  );
  // U8: the count is optional — Campus passes it (its set is fully
  // loaded, so the number is a true total); eBay doesn't (see below).
  // U15: the headings take the search results page's new header
  // treatment (Juan's Stitch reference, adapted — he designs this
  // page properly later): a small coral icon before the Playfair
  // title (MapPin for Campus, Tag for eBay) and the same subtle
  // hairline under the row (the card-grid border tone at 60%).
  // U16 (Juan's review): the titles drop a step (22px → 20px), and
  // the Campus count leaves the title text for a small soft pill
  // beside it — pale teal from the palette, dot + "{n} deals", like
  // his reference. eBay still gets NO count of any kind (U8).
  const sectionHeading = (label, count, Icon) => (
    <div className="flex items-center gap-2 border-b border-pio-grid/60 pb-3 mb-5">
      <Icon size={18} aria-hidden="true" className="text-pio-coral shrink-0" />
      <h2 className="font-playfair text-xl font-semibold text-pio-text text-left m-0">
        {label}
      </h2>
      {count !== undefined && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pio-teal-dark-pale px-2.5 py-[3px] font-jakarta text-xs font-semibold text-pio-teal-dark">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pio-teal-dark shrink-0" />
          {count} {count === 1 ? 'deal' : 'deals'}
        </span>
      )}
    </div>
  );
  const emptyNote = (text) => (
    <p className="text-sm text-pio-text-muted text-left my-0">{text}</p>
  );

  return (

    <div className="page-shell pt-4">
      {/* U16: the hero-sized SearchInput is gone from this page —
          the U15 CompactSearch takes the breadcrumb bar's `end`
          slot instead, exactly as on the results page (Juan's
          reference shows the same small field here). Submit starts
          a new search and lands on the results view (handleSearch
          navigates to /search?query=…); the X keeps the U7 reset
          to the clean home view, same as the Home crumb. On mobile
          the bar hides (U11.1) and the slot renders as its own
          full-width row, as on the results page. */}
      <BreadcrumbNav
        crumbs={crumbs}
        fallback={backFallback}
        className="mb-3"
        end={(
          <CompactSearch
            onSearch={handleSearch}
            onClear={() => { resetSearch(); navigate('/search'); }}
            inputValue={title}
          />
        )}
      />

      {/* U3: a compact book header — the audit found this screen never
          named the book or its author outside the breadcrumb.
          U16: the title drops to a flat 24px (was 24/30px — Juan:
          too big). The space at the header row's right stays EMPTY:
          it is reserved for the future filter/sort controls, so no
          tagline or count goes there. */}
      {(title || author) && (
        <header className="mb-6 text-left">
          <h1 className="font-playfair text-2xl font-semibold leading-tight text-pio-text my-0">
            {title}
          </h1>
          {(author || year) && (
            <p className="text-sm text-pio-text-muted mt-1.5 mb-0">
              {[author ? `by ${author}` : null, year].filter(Boolean).join(' · ')}
            </p>
          )}
        </header>
      )}

      <section className="mb-9">
        {sectionHeading('Campus listings', campusListings.length, MapPin)}
        {campusListings.length ? (
          <div className="card-grid">{campusListings.map(renderCard)}</div>
        ) : (
          emptyNote('No campus listings for this book yet.')
        )}
      </section>

      <section>
        {/* U8: no count here — eBay results stream in as the user
            scrolls (InfiniteScroll below), so any number would just
            be the batch loaded so far, not a total. Juan: "there
            shouldn't be a count of ebay results since they load
            dynamically." Campus keeps its count: that set arrives
            complete from the database. */}
        {sectionHeading('eBay deals', undefined, Tag)}
        {ebayListings.length ? (
          <InfiniteScroll
            dataLength={ebayListings.length}
            next={fetchMoreResults}
            hasMore={hasMore}
            loader={<LoadingResults className="mt-6 mb-16"/>}
            scrollThreshold={1}
            style={{ paddingBottom: '15rem' }}
          >
            <div className="card-grid">{ebayListings.map(renderCard)}</div>
          </InfiniteScroll>
        ) : (
          <>
            {emptyNote('No eBay deals found.')}
            {/* Keep the empty state clear of the floating hub nav. */}
            <div style={{ paddingBottom: '15rem' }} />
          </>
        )}
      </section>
    </div>

  );
}

export default BookList;
