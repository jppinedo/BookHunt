
import React, {useContext, useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { SearchContext } from '@state/SearchContext';
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import { searchEbay } from "@services/EbayAPI";
import { searchBookInDB } from "@services/BookFirestore";
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatEbayBook } from '@utils/search-utils';
import { Spinner } from "@jppinedo/lienzo";
import BookCard from "@custom/Books/BookCard";
import NoResults from "@custom/Search/NoResults";
import LoadingResults from "@custom/Search/LoadingResults";
import NoMoreResults from "@custom/Search/NoMoreResults";
import SearchInput from "@custom/Search/SearchInput";

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
  const { setLastDealsUrl } = useContext(SearchContext);
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

  if (loading && !queryCompleted) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40">
         <Spinner size="48px" thickness="6px" />
      </div>
    );
  }

  // U1.1: the breadcrumb trail for the deals screen. "Results" (and
  // "Home") land on /search, which since U1 restores the preserved
  // Google Books session — the results the user drilled in from.
  const crumbs = [
    { label: 'Home', to: '/search' },
    { label: 'Results', to: '/search' },
    { label: title || 'Deals', current: true },
  ];

  if (queryCompleted && results.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 pt-4 box-border">
        <BreadcrumbNav crumbs={crumbs} fallback={backFallback} />
        <div className="mt-4">
          <NoResults />
        </div>
      </div>
    );
  }

  return (

    <div className="w-full max-w-[1200px] mx-auto px-4 pt-4 box-border">
      <SearchInput onSearch={handleSearch} inputValue={title} className="mb-1" />
      <BreadcrumbNav crumbs={crumbs} fallback={backFallback} className="mb-3" />

      <InfiniteScroll
        dataLength={results.length}
        next={fetchMoreResults}
        hasMore={hasMore}
        loader={<LoadingResults className="mt-6 mb-16"/>}
        endMessage={<NoMoreResults />}
        scrollThreshold={1}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingBottom: '15rem', justifyContent: 'center' }}
      >
        {results.map((item, index) => (
          <BookCard key={`${item.id}-${index}`} book={item} type="grid" onCardClick={handleBookClick} />
        ))}
      </InfiniteScroll>
    </div>

  );
}

export default BookList;
