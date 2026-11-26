import React, {useContext, useEffect, useState} from "react";
import { useParams } from "react-router";
import { useNavigate } from 'react-router';
import { getGoogleBookById } from '@services/GoogleAPI';
import { addBookToDB } from "@services/BookFirestore";
import { formatGoogleBook } from "@utils/search-utils";
import BookCardSeller from "@custom/Books/BookCardSeller";
import BookAddForm from "@custom/Books/BookAddForm";
import LoadingResults from "@custom/Search/LoadingResults";
import {AuthContext} from "@state/AuthContext.jsx";

/** NewBookPage — was MUI Container. Now a Tailwind container div. */
const NewBookPage = () => {
  const { id } = useParams();
  const [ currentBook, setCurrentBook ] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const callGoogleVolume  = async ()  =>  {
      const res = await getGoogleBookById(id);
      return res;
    }

    if(!currentBook && id) {
      callGoogleVolume().then((result) => {
        console.log('Google Book: ', result)
        setCurrentBook(formatGoogleBook(result));
      });
    } else if(!currentBook && !id) {
      navigate('/sell');
    }
  }, [currentBook]);

  const saveBook = (newBook) => {
    const { id, ...bookWithoutId } = newBook;
    addBookToDB(bookWithoutId, user);
    navigate("/search")
  }

  if(!currentBook) {
    return (<LoadingResults className="mt-24" />)
  }

  return (
    <div className="max-w-3xl mx-auto w-full mt-32 mb-36 px-4 box-border">
      <BookCardSeller book={currentBook} type="form" isSingle={true} isNew={true}/>
      <BookAddForm book={currentBook} onSaveBook={saveBook} />
    </div>
  )
}

export default NewBookPage;
