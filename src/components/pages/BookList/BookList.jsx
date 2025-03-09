
import React, {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom';
import { searchEbay } from "@services/EbayAPI";

const BookList = () => {
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

  console.log('query: ', query)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await searchEbay(query);
        setResults(data.itemSummaries || []); // Adjust based on the actual API response structure
      } catch (err) {
        setError(err.message || 'Failed to fetch eBay results');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

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
          <div key={item.itemId} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
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