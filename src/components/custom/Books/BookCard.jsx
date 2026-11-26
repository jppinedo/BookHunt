import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@state/AuthContext";
import { isBookSaved, toggleSavedBook } from "@services/BookFirestore";
import { Badge, Button, Card, Title } from '@jppinedo/lienzo';
import { Bookmark } from 'react-feather';
import BookCover from './BookCover';
import './BookCard.css';

/**
 * BookCard — was MUI Card/CardMedia/CardContent/CardActions + MUI bookmark
 * icons + direct Firestore calls (getFirestore/doc/getDoc/updateDoc).
 * Now: Lienzo Card/Title/Badge/Button, react-feather Bookmark, and the
 * mock Supabase-shaped service layer (isBookSaved / toggleSavedBook).
 * Lienzo Button has no href prop (gap), so external actions use onClick
 * with window.open / location.href.
 */
const BookCard = ({ book, type, onCardClick, isSingle }) => {

  const isClickable = typeof onCardClick === 'function';
  const { user } = useContext(AuthContext);

  const [cardSaved, setCardSaved] = useState(false);

  useEffect(() => {
      if (!user || !book) return;

      const checkSavedStatus = async () => {
          try {
              setCardSaved(await isBookSaved(user, book.id));
          } catch (error) {
              console.error("Error checking saved status!", error);
          }
      };
      checkSavedStatus();
  }, [user, book]);

  async function saveCard() {
      if (!user || !book) return;

      try {
          setCardSaved(await toggleSavedBook(user, book));
      } catch (error) {
          console.error("Error updating saved book!", error);
      }
  }

  const handleCardClick = () => {
    if (isClickable) onCardClick(book);
  }

  if (!book) return null;

  return (
    <Card
      padded={false}
      className={isSingle ? 'book-single-card' : 'book-list-card'}
    >
      <div
        className={`flex text-left ${type === 'grid' ? 'max-w-[560px]' : ''} ${isSingle ? '' : 'p-3'} ${isClickable ? 'cursor-pointer hover:bg-pio-teal-dark-opacity-14' : ''}`}
        onClick={isClickable ? handleCardClick : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? (e) => { if (e.key === 'Enter') handleCardClick(); } : undefined}
      >
        <BookCover
          src={book.thumbnail}
          title={book.title}
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
                {/* U3 / D3: condition appears ONCE — the pill below. The
                    old "Condition: Good" text line duplicated it on the
                    deals, detail, and Saved Books screens. */}
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
              <button
                type="button"
                aria-label={cardSaved ? "Unsave book" : "Save book"}
                aria-pressed={cardSaved}
                onClick={() => saveCard()}
                className="bg-transparent border-0 cursor-pointer p-2"
              >
                <Bookmark fill={cardSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default BookCard;
