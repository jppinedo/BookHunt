import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { getEbayItem } from "@services/EbayAPI";
import { getBookById } from "@services/BookFirestore";
import { Spinner } from '@jppinedo/lienzo';
import { transformEbayItem } from "@utils/search-utils";
import BookCard from '@custom/Books/BookCard';
import { SearchContext } from '@state/SearchContext';
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';


const BookSinglePage = () => {
  const { type, id } = useParams();
  // U1: Back normally retraces history to this book's deals list; the
  // fallback is the last deals URL the session visited (kept in
  // SearchContext), or the preserved search results. U1.1: the same
  // deals URL is where the book-title breadcrumb crumb points.
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
      <div className="page-shell-narrow mt-6 mb-36">
        <BreadcrumbNav
          crumbs={[
            { label: 'Home', to: '/search' },
            { label: 'Results', to: '/search' },
            { label: 'Deal', current: true },
          ]}
          fallback={backFallback}
          className="mb-2"
        />
        <p className="on-bg-text">Book not found.</p>
      </div>
    );
  }
  // U1.1 trail: Home / Results / <book title> / Deal — the title crumb
  // jumps straight back to this book's deals list.
  const dealsUrl = lastDealsUrl || `/search?query=${encodeURIComponent(currentBook.title || '')}`;
  return (
    <div className="page-shell-narrow mt-6 mb-36">
      <BreadcrumbNav
        crumbs={[
          { label: 'Home', to: '/search' },
          { label: 'Results', to: '/search' },
          { label: currentBook.title || 'Book', to: dealsUrl },
          { label: 'Deal', current: true },
        ]}
        fallback={backFallback}
        className="mb-2"
      />
      <BookCard book={currentBook} type="view" isSingle={true} />
    </div>
  )
}

export default BookSinglePage;
