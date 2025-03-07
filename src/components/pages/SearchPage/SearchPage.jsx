import React, { useState } from 'react';
import { searchBooks } from '@services/BookAPI';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';


const SearchPage = () => {
  
  const [books, setBooks] = useState([]);

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