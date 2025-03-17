import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getEbayItem } from "@services/EbayAPI";
import { getBookById } from "@services/BookFirestore";
import { Container, Backdrop, CircularProgress } from '@mui/material';
import { transformEbayItem } from "@utils/search-utils";
import BookCard from '@custom/Books/BookCard';


const BookSinglePage = () => {
  const { type, id } = useParams();
  const [ currentBook, setCurrentBook ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const callEbayItem  = async ()  =>  {
      const res = await getEbayItem(id);
      return res;
    }

    const callFirestoreItem = async () => {
      const res = await getBookById(id);
      return res;
    }

    if(type === 'eBay' && loading) {
      callEbayItem().then((result) => {
        setCurrentBook(transformEbayItem(result)); 
        setLoading(false);
      });
    } else if(type === 'user' && loading) {
      callFirestoreItem().then((result) => {
        setCurrentBook(result);
        setLoading(false);
      });
    }
  }, []);

    
  if (loading) {
    return (
      <Backdrop open={true}>
         <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Container maxWidth="md">
      <BookCard book={currentBook} type="view" isSingle={true} />
    </Container>
  )
}

export default BookSinglePage;