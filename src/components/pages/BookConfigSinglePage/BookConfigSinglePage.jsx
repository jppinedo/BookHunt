import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getEbayItem } from "@services/EbayAPI";
import { getBookById } from "@services/BookFirestore";
import { Spinner } from '@jppinedo/lienzo';
import { transformEbayItem } from "@utils/search-utils";
import BookCardSeller from "@custom/Books/BookCardSeller.jsx";


const BookConfigSinglePage = () => {
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
      }).catch(() => setLoading(false));
    } else if(type === 'user' && loading) {
      callFirestoreItem().then((result) => {
        setCurrentBook(result);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, []);


  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40">
         <Spinner size="48px" thickness="6px" />
      </div>
    );
  }
  if (!currentBook) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 pb-20 box-border">
        <p className="on-bg-text">Book not found.</p>
      </div>
    );
  }
  return (
      <div className="max-w-3xl mx-auto w-full px-4 pb-20 box-border">
        <BookCardSeller book={currentBook} type="view" isSingle={true} />
      </div>
  )
}

export default BookConfigSinglePage;
