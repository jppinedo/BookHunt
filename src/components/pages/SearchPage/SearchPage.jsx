import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchGoogleBooks } from '@services/GoogleAPI';
import { useNavigate } from 'react-router';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';
import InfoBox from '@custom/Shared/InfoBox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LoadingResults from '@custom/Search/LoadingResults';
import logo from '@assets/images/book_hunt_logo.png';

const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('query');

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

  const setQueryParam = (query) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  }

  useEffect(() => {
    if(urlQuery?.length) {
      handleSearch(urlQuery);
    }
  }, [urlQuery])

  return (
    <div>
      <img src={logo} width="200px" style={{marginBottom: '2rem'}} />
      {!books.length ? (
        <InfoBox icon={MenuBookIcon} content="Search below for the book you are looking for." />
      ) : null}
      
      <SearchInput onSearch={setQueryParam} inputValue={urlQuery || ''}/>
      
      {!books.length && urlQuery ? (
        <LoadingResults sx={{mt: 3}} />
      ) : (
        <>
        {books.length ? (
          <InfoBox icon={MenuBookIcon} content="Click on a book to start finding deals!" />
        ) : null}
        
        <BookResults books={books} onClickItem={handleItemClick} />
        </>
      )}
      
    </div>
  );
};


export default SearchPage;