import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { AppContext } from "@state/AppContext";
import { getEbayItem } from "@services/EbayAPI";
import { Container } from '@mui/material';
import { transformEbayItem } from "@utils/search-utils";
import BookCard from '@custom/Books/BookCard';


const BookSinglePage = () => {
    const { type, id } = useParams();
    const { currentBook, setCurrentBook } = useContext(AppContext);

  useEffect(() => {
    const callEbayItem  = async ()  =>  {
      const res = await getEbayItem(id);
      return res;
    }

    if(!currentBook && type === 'eBay') {
      callEbayItem().then((results) => {
        console.log(results); 
        setCurrentBook(transformEbayItem(results)); 
      });
    }
  }, [currentBook]);

    
    if(!currentBook) {
      return ( <p>Loading...</p> )
    }
    return (
      <Container maxWidth="md">
        <BookCard book={currentBook} type="view" />
      </Container>
    )
}

export default BookSinglePage;