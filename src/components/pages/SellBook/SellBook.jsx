import React, { useState, useContext } from 'react';
import { searchGoogleBooks } from '@services/GoogleAPI';
import { useNavigate } from 'react-router';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
      <img src={logo} width="200px" style={{marginBottom: '2rem'}} />
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