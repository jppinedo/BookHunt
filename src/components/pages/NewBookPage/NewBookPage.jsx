import React, {useContext, useEffect, useState} from "react";
import { useParams } from "react-router";
import { useNavigate } from 'react-router';
import { getGoogleBookById } from '@services/GoogleAPI';
import { addBookToDB } from "@services/BookFirestore";
import { formatGoogleBook } from "@utils/search-utils";
import BookCardSeller from "@custom/Books/BookCardSeller";
import BookAddForm from "@custom/Books/BookAddForm";
import LoadingResults from "@custom/Search/LoadingResults";
import { Button, Card, Title } from '@jppinedo/lienzo';
import { CheckCircle } from 'react-feather';
import {AuthContext} from "@state/AuthContext.jsx";

/** NewBookPage — was MUI Container. Now a Tailwind container div. */
const NewBookPage = () => {
  const { id } = useParams();
  const [ currentBook, setCurrentBook ] = useState(null);
  // U4: the title of the listing once it is live — non-null swaps the
  // form for the confirmation screen (previously a successful submit
  // silently redirected to /search: no confirmation, no link to the
  // new listing — the audit's Sell finding).
  const [ listedTitle, setListedTitle ] = useState(null);
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

  // Async since U4: addBookToDB resolves to the new listing id, or to
  // undefined when the write failed (both data-layer backends catch and
  // log internally). A missing id therefore THROWS here, so BookAddForm
  // can show an inline error instead of the old silent redirect.
  const saveBook = async (newBook) => {
    const { id: _googleId, ...bookWithoutId } = newBook;
    const listingId = await addBookToDB(bookWithoutId, user);
    if (!listingId) {
      throw new Error('Listing was not saved');
    }
    setListedTitle(newBook.title);
  }

  if (listedTitle) {
    return (
      <div className="page-shell-narrow mt-32 mb-36">
        <Card className="min-w-[300px] w-full text-center">
          <CheckCircle size={44} className="mx-auto text-pio-coral" aria-hidden="true" />
          <Title size="md" className="mt-3">Your listing is live</Title>
          <p className="mt-2 text-[15px]">
            “{listedTitle}” is now listed for sale. Buyers searching for it
            will see it under Campus listings.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              label="View my listings"
              onClick={() => navigate('/my-listings')}
            />
            <Button
              label="Back to search"
              fill="outline"
              onClick={() => navigate('/search')}
            />
          </div>
        </Card>
      </div>
    );
  }

  if(!currentBook) {
    return (<LoadingResults className="mt-24" />)
  }

  return (
    <div className="page-shell-narrow mt-32 mb-36">
      <BookCardSeller book={currentBook} type="form" isSingle={true} isNew={true}/>
      <BookAddForm book={currentBook} onSaveBook={saveBook} />
    </div>
  )
}

export default NewBookPage;
