import React, { useContext } from "react";
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { useToast } from '@state/ToastContext';
import { deleteListedBook } from "@services/BookFirestore";
import { Badge, Button, Card, Title } from '@jppinedo/lienzo';
import { ExternalLink, Trash2 } from 'react-feather';
import { useNavigate } from "react-router-dom";
import BookCover from './BookCover';
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
  const { showToast } = useToast();

  async function deleteCard() {
      if (!user || !book) return

      try {
          await deleteListedBook(user, book.id);
          // U4: confirm the delete with a toast (it renders at shell
          // level, so it survives this navigation) and land on the
          // My Listings page the listing was managed from (U9: its
          // own route — it was the Profile Book Listings tab, reached
          // via U2's deep-link state, until this step).
          showToast('Listing deleted');
          navigate("/my-listings");
      } catch (error) {
        onShowError(error);
      }
  }

  const handleCardClick = () => {
    if (isClickable) onCardClick(book);
  }

  if (!book) return null;

  // U14: the single VIEW (the owner's listing screen on
  // BookConfigSinglePage) joins BookCard's Stitch two-column detail
  // layout — same shell, same actions ("This is your listing" +
  // Delete; Edit stays on the page below the card). Form mode (Sell
  // flow) and the My Listings grid cards keep the rendering below.
  if (isSingle && type === 'view') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        <Card
          padded={false}
          className="book-detail-card w-full lg:col-start-6 lg:col-span-7 lg:row-start-1"
        >
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {book.condition && (
                  <Badge label={book.condition} tone="teal" />
                )}
              </div>
              <p className="text-sm text-pio-text-muted m-0">
                Sold by{' '}
                <span className="text-pio-text font-medium">
                  {book.sellerName} ({book.sellerType})
                </span>
              </p>
            </div>

            <div>
              <Title size="xxl" fontFamily="playfair" className="page-title leading-tight">
                {book.title}
              </Title>
              {book.authors?.length ? (
                <p className="mt-1.5 mb-0 text-pio-text-muted">by {book.authors.join(', ')}</p>
              ) : null}
            </div>

            {book.description?.length ? (
              <p className="text-sm text-pio-text-muted m-0">{book.description}</p>
            ) : null}

            <div className="bg-pio-bg border border-pio-grid rounded-2xl p-5">
              <span className="text-2xl font-semibold tabular-nums">
                {`$${book.price} ${book.currency}`}
              </span>
            </div>

            {!isClickable && (
              <div className="flex flex-wrap items-center gap-3">
                {book.sellerType === 'eBay' && (
                  <button
                    type="button"
                    onClick={() => window.open(book.URL, '_blank', 'noopener,noreferrer')}
                    className="flex-1 min-w-[200px] h-[46px] px-6 rounded-full bg-pio-coral text-white text-[15px] font-semibold border-0 cursor-pointer inline-flex items-center justify-center gap-2 transition-colors hover:bg-pio-coral-hover active:bg-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral-dark"
                  >
                    View on eBay
                    <ExternalLink size={16} aria-hidden="true" />
                  </button>
                )}
                {book.sellerType === 'user' && (
                  <span className="text-sm font-semibold text-pio-coral">This is your listing</span>
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
        </Card>

        <Card
          padded={false}
          className="book-detail-card w-full p-4 lg:col-start-1 lg:col-span-5 lg:row-start-1"
        >
          <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-pio-bg-light border border-pio-grid">
            <BookCover
              src={book.thumbnail}
              title={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card padded={false} className="book-single-card w-full h-full">
      <div
        className={`flex text-left w-full h-full ${isSingle ? '' : 'p-3'} ${isClickable ? 'cursor-pointer hover:bg-pio-teal-dark-opacity-14' : ''}`}
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
                {/* U3 / D3: condition shows once — the pill below (same
                    dedupe as BookCard). */}
                <p className="my-1">Sold by: {book.sellerName} ({book.sellerType})</p>
                {book.condition && (
                  <Badge label={book.condition} tone="teal" className="mt-1" />
                )}
              </>
            )}
            {/* U4: in form mode (Sell flow) the description is NOT
                dumped here — it pushed the price/condition form below
                the fold. It lives in BookAddForm now, last and
                optional, behind its toggle. */}
            {(isSingle && type !== 'form' && book.description?.length) && (
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
              {/* U4: this card's view mode is the owner's own listing
                  screen (/bookConfig) — "Contact seller" here mailed
                  the seller themselves. It now says what it is; Edit
                  and Delete are the actions (Edit lives on the page,
                  below the card). */}
              {type === 'view' && book.sellerType === 'user' && (
                <span className="text-sm font-semibold text-pio-coral">This is your listing</span>
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
