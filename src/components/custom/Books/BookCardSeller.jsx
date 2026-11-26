import React, { useContext } from "react";
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { deleteListedBook } from "@services/BookFirestore";
import { Badge, Button, Card, Title } from '@jppinedo/lienzo';
import { Trash2 } from 'react-feather';
import { useNavigate } from "react-router-dom";
import './BookCard.css';

/**
 * BookCardSeller — seller variant of BookCard. Was MUI + direct Firestore
 * (find listing id in userInfo.booksListed, deleteDoc + arrayRemove).
 * Now: Lienzo primitives + react-feather Trash2 + the mock service layer
 * (deleteListedBook). In the mock model the listing IS the book object, so
 * the old "look up the listing id by deep-comparing the book" dance is gone;
 * a Supabase version deletes by listings.id directly, as here.
 */
const BookCardSeller = ({ book, type, onCardClick, isSingle, isNew }) => {

  const isClickable = typeof onCardClick === 'function';
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { onShowError } = useContext(AppContext);

  async function deleteCard() {
      if (!user || !book) return

      try {
          await deleteListedBook(user, book.id);
          navigate("/profile");
      } catch (error) {
        onShowError(error);
      }
  }

  const handleCardClick = () => {
    if (isClickable) onCardClick(book);
  }

  if (!book) return null;

  return (
    <Card padded={false} className="book-single-card">
      <div
        className={`flex text-left ${type === 'grid' ? 'max-w-[560px]' : ''} ${isSingle ? '' : 'p-3'} ${isClickable ? 'cursor-pointer hover:bg-pio-teal-dark-opacity-14' : ''}`}
        onClick={isClickable ? handleCardClick : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? (e) => { if (e.key === 'Enter') handleCardClick(); } : undefined}
      >
        <img
          src={book.thumbnail}
          alt={book.title}
          className="h-full object-contain self-start"
          style={{ maxWidth: isSingle ? '290px' : '200px', padding: isSingle ? '1rem' : 0 }}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="p-3">
            <Title size="md" className="leading-tight mb-2">
              {book.title}
            </Title>
            {book.authors?.length ? (
              <p className="my-1">Authors: {book.authors.join(', ')}</p>
            ) : null}
            {(type === 'view' || type === 'grid') && (
              <>
                <p className="my-1">Condition: {book.condition}</p>
                <p className="my-1">Sold by: {book.sellerName} ({book.sellerType})</p>
                {book.condition && (
                  <Badge label={book.condition} tone="teal" className="mt-1" />
                )}
              </>
            )}
            {(isSingle && book.description?.length) && (
              <p className="text-sm my-2">{book.description}</p>
            )}
            {type !== 'form' && (
              <Title size="sm" color="coral" className="mt-2">
                {`$${book.price} ${book.currency}`}
              </Title>
            )}
          </div>
          {(type !== 'grid' && !isClickable) && (
            <div className="flex items-center gap-2 px-3 pb-3">
              {type === 'view' && book.sellerType === 'eBay' && (
                <Button
                  label="View on eBay"
                  onClick={() => window.open(book.URL, '_blank', 'noopener,noreferrer')}
                />
              )}
              {type === 'view' && book.sellerType === 'user' && (
                <Button
                  label="Contact seller"
                  onClick={() => { window.location.href = `mailto:${book.sellerEmail}`; }}
                />
              )}
              {!isNew && (
                <button
                  type="button"
                  aria-label="Delete listing"
                  onClick={() => { deleteCard() }}
                  className="bg-transparent border-0 cursor-pointer p-2"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default BookCardSeller;
