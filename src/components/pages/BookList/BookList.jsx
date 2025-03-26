
import React, {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { searchEbay } from "@services/EbayAPI";
import { searchBookInDB } from "@services/BookFirestore";
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatEbayBook } from '@utils/search-utils';
import { Backdrop, CircularProgress, Container } from "@mui/material";
import BookCard from "@custom/Books/BookCard";
import NoResults from "@custom/Search/NoResults";
import LoadingResults from "@custom/Search/LoadingResults";
import NoMoreResults from "@custom/Search/NoMoreResults";
import SearchInput from "@custom/Search/SearchInput";

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

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ebayData, bdData] = await Promise.all([
          searchEbay(query, limit, offset), 
          searchBookInDB(params)
        ]);
        // const [ebayData] = await Promise.all([searchEbay(query)]);

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
      setHasMore(formatedEbayResults.length === limit); // Check if there are more results
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
      <Backdrop open={true}>
         <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (results.length === 0) {
    return <NoResults />;
  }

  return (

    <Container sx={{paddingTop: '4rem'}}>
      <SearchInput onSearch={handleSearch} inputValue={title} sx={{mb:2}} />
      
      <InfiniteScroll
        dataLength={results.length}
        next={fetchMoreResults}
        hasMore={hasMore}
        loader={<LoadingResults sx={{mt:3, mb:8}}/>}
        endMessage={<NoMoreResults />}
        scrollThreshold={1}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingBottom: '15rem', justifyContent: 'center' }}
      >
        {results.map((item, index) => (
          <BookCard key={`${item.id}-${index}`} book={item} type="grid" onCardClick={handleBookClick} />
        ))}
      </InfiniteScroll>
    </Container>

  );
}

export default BookList;