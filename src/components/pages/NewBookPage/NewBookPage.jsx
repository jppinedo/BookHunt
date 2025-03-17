import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from 'react-router';
import { getGoogleBookById } from '@services/GoogleAPI';
import { addBookToDB } from "@services/BookFirestore";
import { formatGoogleBook } from "@utils/search-utils";
import { Container } from '@mui/material';
import BookCard from '@custom/Books/BookCard';
import BookAddForm from "@custom/Books/BookAddForm";

const NewBookPage = () => {
  const { id } = useParams();
  const [ currentBook, setCurrentBook ] = useState(null);
  const navigate = useNavigate();

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
    addBookToDB(bookWithoutId);
  }

  if(!currentBook) {
    return (<p>Loading...</p>)
  }

  return (
    <Container maxWidth="md">
      <BookCard book={currentBook} type="form" isSingle={true}/>
      <BookAddForm book={currentBook} onSaveBook={saveBook} />
    </Container>
  )
}

export default NewBookPage;