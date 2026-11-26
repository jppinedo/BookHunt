import React, { useState } from 'react';
import { searchGoogleBooks } from '@services/GoogleAPI';
import { useNavigate } from 'react-router';
import SearchInput from '@custom/Search/SearchInput';
import BookResults from '@custom/Search/BookResults';
import { BookOpen as MenuBookIcon } from 'react-feather';
import InfoBox from '@custom/Shared/InfoBox';
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';

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
      {/* U1: Sell is reached from the menu and used to be a dead end.
          U1.1: the breadcrumb bar (Back + Home / Sell a Book) replaces
          the lone Back button, and the big centered logo is gone — the
          PageBrand header in the app shell is this page's brand now, so
          the logo is always at the top and always links Home. */}
      <div className="page-shell pt-2">
        <BreadcrumbNav
          crumbs={[
            { label: 'Home', to: '/search' },
            { label: 'Sell a Book', current: true },
          ]}
          fallback="/search"
        />
      </div>
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
