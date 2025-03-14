
import React, {useEffect, useState, useContext} from "react";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { searchEbay } from "@services/EbayAPI";
import { AppContext } from "@state/AppContext";
import { formatEbayBook } from '@utils/search-utils';

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
        setResults([...ebayData.itemSummaries]);
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
    const ebayBook = formatEbayBook(item);
    setCurrentBook(ebayBook);
    navigate(`/book/${ebayBook.sellerType}/${ebayBook.id}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      <h2>eBay Search Results</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {results.map((item) => (
          <div 
            key={item.itemId} 
            style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}
            role="button"
            tabIndex={0}
            onClick={() => handleBookClick(item)}
          >
            <img src={item.image?.imageUrl} alt={item.title} style={{ width: '100%', height: 'auto' }} />
            <h3>{item.title}</h3>
            <p><strong>Price:</strong> {item.price?.value} {item.price?.currency}</p>
            <p><strong>Condition:</strong> {item.condition}</p>
            <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer">View on eBay</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList;