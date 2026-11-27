import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { useToast } from '@state/ToastContext';
import { isBookSaved, toggleSavedBook, deleteListedBook } from "@services/BookFirestore";
import { Badge, Button, Card, Title } from '@jppinedo/lienzo';
import { Bookmark, Star } from 'react-feather';
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
// --- U12: detail-page enrichment helpers -------------------------------------
// All values come from transformEbayItem's optional fields; every helper
// returns null on missing/malformed data so blocks simply don't render.
const compactCount = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0) return null;
  if (num >= 10000) return `${Math.round(num / 1000)}k`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
};

const moneyText = (value, currency) => {
  const num = parseFloat(value);
  if (!Number.isFinite(num)) return null;
  const base = `$${num.toFixed(2)}`;
  return currency && currency !== 'USD' ? `${base} ${currency}` : base;
};

const deliveryText = (win) => {
  if (!win) return null;
  try {
    const parse = (s) => {
      const d = s ? new Date(s) : null;
      return d && !Number.isNaN(d.getTime()) ? d : null;
    };
    const min = parse(win.min);
    const max = parse(win.max);
    const monthDay = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
    if (min && max) {
      // Same month: "Arrives Dec 1 – 5"; otherwise spell out both ends.
      if (min.getMonth() === max.getMonth() && min.getFullYear() === max.getFullYear()) {
        const month = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(min);
        return `Arrives ${month} ${min.getDate()} – ${max.getDate()}`;
      }
      return `Arrives ${monthDay.format(min)} – ${monthDay.format(max)}`;
    }
    if (max) return `Arrives by ${monthDay.format(max)}`;
    if (min) return `Arrives ${monthDay.format(min)}`;
  } catch {
    return null;
  }
  return null;
};

const RatingStars = ({ rating }) => {
  const filled = Math.max(0, Math.min(5, Math.round(rating.average)));
  const count = Number(rating.count);
  return (
    <div className="flex items-center gap-1.5 my-1">
      <span
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${rating.average.toFixed(1)} out of 5`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            size={14}
            aria-hidden="true"
            className={i < filled ? 'text-pio-coral' : 'text-pio-text-muted'}
            fill={i < filled ? 'currentColor' : 'none'}
          />
        ))}
      </span>
      <span className="text-sm text-pio-text-muted">
        {rating.average.toFixed(1)}
        {Number.isFinite(count) && count > 0
          ? ` · ${count} ${count === 1 ? 'rating' : 'ratings'}`
          : ''}
      </span>
    </div>
  );
};

const BookCard = ({ book, type, onCardClick, isSingle }) => {

  const isClickable = typeof onCardClick === 'function';
  const { user } = useContext(AuthContext);
  const { onShowError } = useContext(AppContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // U4: the viewer's own listing (matched by seller email — both data
  // backends stamp sellerEmail on every user listing). Own listings get
  // Edit/Delete instead of "Contact seller" (which mailed yourself).
  const isOwnListing = Boolean(
    book?.sellerType === 'user' &&
    user?.email && book?.sellerEmail &&
    book.sellerEmail.toLowerCase() === user.email.toLowerCase()
  );

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
          const saved = await toggleSavedBook(user, book);
          setCardSaved(saved);
          // U4: saving used to give no feedback at all (audit, Save
          // finding). The saved toast carries a shortcut to the shelf.
          if (saved) {
              showToast('Saved to Books Saved', {
                  actionLabel: 'View',
                  onAction: () => navigate('/saved'),
              });
          } else {
              showToast('Removed from saved books');
          }
      } catch (error) {
          console.error("Error updating saved book!", error);
      }
  }

  async function deleteOwnListing() {
      if (!user || !book) return;

      try {
          await deleteListedBook(user, book.id);
          showToast('Listing deleted');
          navigate('/my-listings');
      } catch (error) {
          onShowError(error);
      }
  }

  const handleCardClick = () => {
    if (isClickable) onCardClick(book);
  }

  if (!book) return null;

  // U12: eBay detail enrichment — only on the single (detail) view of an
  // eBay book, and every block below is gated on its data being present,
  // so a partial item renders exactly the pre-U12 page.
  const showDetailExtras = Boolean(isSingle && type === 'view' && book.sellerType === 'eBay');
  const feedbackScoreText = showDetailExtras ? compactCount(book.sellerFeedbackScore) : null;
  const deliveryLine = showDetailExtras ? deliveryText(book.deliveryWindow) : null;
  const detailAspects = showDetailExtras && Array.isArray(book.aspects) ? book.aspects : [];

  let shippingLine = null;
  let importLine = null;
  let totalLine = null;
  if (showDetailExtras && book.shippingCost) {
    const cost = parseFloat(book.shippingCost.value);
    if (Number.isFinite(cost)) {
      if (cost === 0) {
        shippingLine = 'Free shipping';
      } else {
        shippingLine = `+ ${moneyText(book.shippingCost.value, book.shippingCost.currency)} shipping`;
        if (book.importCharges) {
          // A landed total would be a guess — flag the extra charge instead.
          const amt = moneyText(book.importCharges.value, book.importCharges.currency);
          importLine = amt ? `+ ${amt} import charges` : '+ import charges';
        } else if (book.shippingCost.currency === book.currency) {
          const total = parseFloat(book.price) + cost;
          if (Number.isFinite(total)) totalLine = `Total ${moneyText(total, book.currency)}`;
        }
      }
    }
  }
  const hasShippingBlock = Boolean(
    shippingLine || importLine || totalLine || deliveryLine || (showDetailExtras && book.shipsFrom)
  );

  return (
    <Card
      padded={false}
      className={`${isSingle ? 'book-single-card' : 'book-list-card'} w-full h-full`}
    >
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
            {/* U12: eBay catalog product rating — only when eBay matched
                the listing to a catalog product (often absent). */}
            {showDetailExtras && book.rating && (
              <RatingStars rating={book.rating} />
            )}
            {(type === 'view' || type === 'grid') && (
              <>
                {/* U3 / D3: condition appears ONCE — the pill below. The
                    old "Condition: Good" text line duplicated it on the
                    deals, detail, and Saved Books screens. */}
                <p className="my-1">Sold by: {book.sellerName} ({book.sellerType})</p>
                {/* U12: seller trust — feedback summary under the Sold by
                    line, Top Rated pill beside the condition badge. */}
                {showDetailExtras && book.sellerFeedbackPercentage && (
                  <p className="my-1 text-sm text-pio-text-muted">
                    {`${book.sellerFeedbackPercentage}% positive`}
                    {feedbackScoreText ? ` (${feedbackScoreText} feedback)` : ''}
                  </p>
                )}
                {book.condition && (
                  <Badge label={book.condition} tone="teal" className="mt-1" />
                )}
                {showDetailExtras && book.topRatedSeller && (
                  <Badge label="Top Rated" tone="amber" className="mt-1 ml-1" />
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
            {/* U12: shipping & location — the true-cost lines under the
                price. Renders only when at least one line has data. */}
            {showDetailExtras && hasShippingBlock && (
              <div className="mt-3 pt-3 border-t border-pio-grid text-sm">
                {shippingLine && <p className="my-0.5">{shippingLine}</p>}
                {importLine && <p className="my-0.5 text-pio-text-muted">{importLine}</p>}
                {totalLine && <p className="my-0.5 font-semibold">{totalLine}</p>}
                {deliveryLine && <p className="my-0.5 text-pio-text-muted">{deliveryLine}</p>}
                {book.shipsFrom && (
                  <p className="my-0.5 text-pio-text-muted">Ships from {book.shipsFrom}</p>
                )}
              </div>
            )}
            {/* U12: book facts — generic label/value list from the
                seller's own item specifics (this is where the Author for
                eBay books finally appears). */}
            {showDetailExtras && detailAspects.length > 0 && (
              <div className="mt-3 pt-3 border-t border-pio-grid">
                <p className="text-sm font-semibold mt-0 mb-2">Book details</p>
                <dl className="my-0">
                  {detailAspects.map((aspect, i) => (
                    <div key={`${aspect.name}-${i}`} className="flex text-sm py-0.5">
                      <dt className="text-pio-text-muted w-[110px] shrink-0">{aspect.name}</dt>
                      <dd className="flex-1 min-w-0 m-0">{aspect.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
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
              {type === 'view' && book.sellerType === 'user' && !isOwnListing && (
                <Button
                  label="Contact seller"
                  onClick={() => { window.location.href = `mailto:${book.sellerEmail}`; }}
                />
              )}
              {type === 'view' && isOwnListing && (
                <>
                  <span className="text-sm font-semibold text-pio-coral">This is your listing</span>
                  <Button
                    label="Edit"
                    onClick={() => navigate(`/bookConfig/user/${book.id}`)}
                  />
                  <Button
                    label="Delete"
                    type="red"
                    onClick={() => { deleteOwnListing() }}
                  />
                </>
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
