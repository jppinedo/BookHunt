import React, { useState, useContext } from 'react';
import { searchGoogleBooks } from '@services/BookAPI';
import { useNavigate } from 'react-router';
import { AppContext } from "@state/AppContext";
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';

const SellBook = () => {

  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { currentBook, setCurrentBook } = useContext(AppContext);

  const handleSearch = async (query) => {
    const results = await searchGoogleBooks(query);
    setBooks(results);
};

  const handleItemClick = (book) => {
    setCurrentBook(book);
    navigate('/new');
  }

  return (
    <div>
      <h1>Search for your Textbook</h1>
      <SearchInput onSearch={handleSearch} />
      <BookResults books={books} onClickItem={handleItemClick} />
    </div>
  );
}

export default SellBook;