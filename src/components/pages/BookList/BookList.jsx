
import React, {useEffect, useState, useContext} from "react";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { searchEbay } from "@services/EbayAPI";
import { AppContext } from "@state/AppContext";
import { formatEbayBook } from '@utils/search-utils';
import { Backdrop, CircularProgress, Container, Box } from "@mui/material";
import BookCard from "@custom/Books/BookCard";
import NoResults from "@custom/Search/NoResults";

const BookList = () => {
  const { setCurrentBook } = useContext(AppContext);
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        // const [ebayData, bdData] = await Promise.all([searchEbay(query), searchDBBooks(query)]);
        const [ebayData] = await Promise.all([searchEbay(query)]);
        // setResults([...ebayData.itemSummaries, ...bdData.itemSummaries]);
        if(ebayData?.itemSummaries?.length) setResults([...ebayData?.itemSummaries]);
        else setResults([]);
        
      } catch (err) {
        setError(err.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  

  const handleBookClick = (item) => {
    setCurrentBook(item);
    navigate(`/book/${item.sellerType}/${item.id}`);
  }

  if (loading) {
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
    <Container >
      <h2>eBay Search Results</h2>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {results.map((item) => (
          <BookCard book={formatEbayBook(item)} type="grid" onCardClick={handleBookClick} />
        ))}
      </Box>
    </Container>
  );
}

export default BookList;