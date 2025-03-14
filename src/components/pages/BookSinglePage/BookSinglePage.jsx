import React, { useContext } from "react";
import { useParams } from "react-router";
import { AppContext } from "@state/AppContext";
import { Container } from '@mui/material';
import BookCard from '@custom/Books/BookCard';


const BookSinglePage = () => {
    const { type, id } = useParams();
    const { currentBook } = useContext(AppContext);

    return (
      <Container maxWidth="md">
        <BookCard book={currentBook} type="view" />
      </Container>
    )
}

export default BookSinglePage;