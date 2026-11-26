import React, { useState } from 'react';
import { searchGoogleBooks } from '@services/GoogleAPI';
import { useNavigate } from 'react-router';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';
import { BookOpen as MenuBookIcon } from 'react-feather';
import logo from '@assets/images/book_hunt_logo.png';
import InfoBox from '@custom/Shared/InfoBox';

const SellBook = () => {

  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    const results = await searchGoogleBooks(query);
    setBooks(results);
};

  const handleItemClick = (book) => {
    navigate(`/new/${book.id}`);
  }

  return (
    <div>
      <img src={logo} alt="Book Hunt" style={{display: 'block', width: '168px', height: 'auto', margin: '0.75rem auto 0.5rem'}} />
      {!books.length ? (
        <InfoBox icon={MenuBookIcon} content="Search below for the book you are looking to sell." />
      ) : null}
      <SearchInput onSearch={handleSearch} />
      {books.length ? (
        <InfoBox icon={MenuBookIcon} content="Click on the book you want to sell" />
      ) : null}
      <BookResults books={books} onClickItem={handleItemClick} />
    </div>
  );
}

export default SellBook;
