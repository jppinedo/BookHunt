import React, { useState, useContext, useEffect } from 'react';
import { searchBooks } from '@services/BookAPI';
import { getEbayToken } from '@services/EbayAPI';
import { AppContext } from '@state/AppContext';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';


const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const { setEBayToken } = useContext(AppContext);

  useEffect(() => {

      getEbayToken()
        .then((token) => {
          setEBayToken(token);
        })
        .catch((error) => {
          console.error('Failed to fetch token:', error);
        });
  }, [])

  const handleSearch = async (query) => {
    const results = await searchBooks(query);
    setBooks(results);
  };

  return (
    <div>
      <h1>Find Your Textbook</h1>
      <SearchInput onSearch={handleSearch} />
      <BookResults books={books} />
    </div>
  );
};

export default SearchPage;