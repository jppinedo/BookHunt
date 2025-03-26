import React from "react";
import BookCard from "./BookCard";
import { Container } from '@mui/material';

const BookSingle = ({ type, book }) => {

  

  return (
    <Container maxWidth="md">
      <BookCard book={book} type={type} />
      {/* show form items if adding new book */}
      {type === 'form' && (
        <BookAddForm book={book} />
      )}
    </Container>
  );
}

export default BookSingle;