import React, { useState } from 'react';
import { searchGoogleBooks } from '@services/GoogleAPI';
import { useNavigate } from 'react-router';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';

const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    const results = await searchGoogleBooks(query);
    setBooks(results);
  };

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

  return (
    <div>
      <h1>Find Your Textbook</h1>
      <SearchInput onSearch={handleSearch} />
      <BookResults books={books} onClickItem={handleItemClick} />
    </div>
  );
};

export default SearchPage;