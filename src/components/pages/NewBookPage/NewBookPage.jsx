import React, { useContext, useEffect } from "react";
import { AppContext } from "@state/AppContext";
import { useNavigate } from 'react-router';
import { addBookToDB } from "@services/BookFirestore";
import { Container } from '@mui/material';
import BookCard from '@custom/Books/BookCard';
import BookAddForm from "@custom/Books/BookAddForm";

const NewBookPage = () => {
  const { currentBook, setCurrentBook } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(!currentBook) navigate('/sell');
    else console.log(currentBook)
  }, [currentBook]);

  const saveBook = (newBook) => {
    setCurrentBook(newBook);
    addBookToDB(newBook);
  }

  return (
    <Container maxWidth="md">
      <BookCard book={currentBook} type="form" />
      <BookAddForm book={currentBook} onSaveBook={saveBook} />
    </Container>
  )
}

export default NewBookPage;