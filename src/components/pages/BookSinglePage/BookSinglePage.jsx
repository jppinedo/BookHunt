import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { getEbayItem } from "@services/EbayAPI";
import { getBookById } from "@services/BookFirestore";
import { Spinner } from '@jppinedo/lienzo';
import { transformEbayItem } from "@utils/search-utils";
import BookCard from '@custom/Books/BookCard';
import { SearchContext } from '@state/SearchContext';
import BackButton from '@custom/Navigation/BackButton';


const BookSinglePage = () => {
  const { type, id } = useParams();
  // U1: Back normally retraces history to this book's deals list; the
  // fallback is the last deals URL the session visited (kept in
  // SearchContext), or the preserved search results.
  const { lastDealsUrl } = useContext(SearchContext);
  const backFallback = lastDealsUrl || '/search';
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
      <div className="max-w-3xl mx-auto w-full mt-24 mb-36 px-4 box-border">
        <BackButton fallback={backFallback} className="mb-2" />
        <p className="on-bg-text">Book not found.</p>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto w-full mt-24 mb-36 px-4 box-border">
      <BackButton fallback={backFallback} className="mb-2" />
      <BookCard book={currentBook} type="view" isSingle={true} />
    </div>
  )
}

export default BookSinglePage;
