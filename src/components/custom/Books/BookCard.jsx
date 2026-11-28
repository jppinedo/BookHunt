import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { useToast } from '@state/ToastContext';
import { isBookSaved, toggleSavedBook, deleteListedBook } from "@services/BookFirestore";
import { Badge, Button, Card, Title } from '@jppinedo/lienzo';
import { ArrowRight, Bookmark, CheckCircle, ExternalLink, MapPin, Minus, Plus, Star, Truck } from 'react-feather';
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
  // U12.1: the Book details facts list can run to ~19 rows — collapsed
  // to the first 3 behind a See more toggle by default.
  const [detailsExpanded, setDetailsExpanded] = useState(false);

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
  // U12.1: eBay sometimes returns a rating object with average 0.0 and
  // no reviews — that's no rating at all, so the stars block must not
  // render unless at least one person actually rated it above zero.
  const hasRating = Boolean(
    showDetailExtras && book.rating &&
    Number(book.rating.count) >= 1 && Number(book.rating.average) > 0
  );
  const visibleAspects = detailsExpanded ? detailAspects : detailAspects.slice(0, 3);

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

  // U14: the DETAIL view is restructured to Juan's Stitch two-column
  // editorial layout — no new data, the U12/U12.1 blocks above are
  // simply re-homed. DOM order is deal → cover → details so mobile
  // (single column) reaches the title, price and actions first; at lg
  // the grid places the cover card top-left (5/12), the facts card
  // under it, and the deal card on the right (7/12, spanning both
  // rows). The grid/list rendering below is untouched.
  if (isSingle) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        {/* DEAL CARD — condition + seller, headline, rating,
            description, price box, actions. */}
        <Card
          padded={false}
          className="book-detail-card w-full lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-2"
        >
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {book.condition && (
                  <Badge label={book.condition} tone="teal" />
                )}
                {showDetailExtras && book.topRatedSeller && (
                  <Badge label="Top Rated" tone="amber" />
                )}
              </div>
              {(type === 'view' || type === 'grid') && (
                <p className="flex items-center gap-1.5 text-sm text-pio-text-muted m-0">
                  {showDetailExtras && book.sellerFeedbackPercentage && (
                    <CheckCircle size={15} className="text-pio-teal-dark shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    Sold by{' '}
                    <span className="text-pio-text font-medium">
                      {book.sellerName} ({book.sellerType})
                    </span>
                    {showDetailExtras && book.sellerFeedbackPercentage && (
                      <>
                        {` · ${book.sellerFeedbackPercentage}% positive`}
                        {feedbackScoreText ? ` (${feedbackScoreText} feedback)` : ''}
                      </>
                    )}
                  </span>
                </p>
              )}
            </div>

            <div>
              <Title size="xxl" fontFamily="playfair" className="page-title leading-tight">
                {book.title}
              </Title>
              {book.authors?.length ? (
                <p className="mt-1.5 mb-0 text-pio-text-muted">by {book.authors.join(', ')}</p>
              ) : null}
              {hasRating && (
                <RatingStars rating={book.rating} />
              )}
            </div>

            {book.description?.length ? (
              <p className="text-sm text-pio-text-muted m-0">{book.description}</p>
            ) : null}

            {type !== 'form' && (
              <div className="bg-pio-bg border border-pio-grid rounded-2xl p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-2xl font-semibold tabular-nums">
                      {`$${book.price} ${book.currency}`}
                    </span>
                    {shippingLine && (
                      <span className="text-sm text-pio-text-muted">{shippingLine}</span>
                    )}
                  </div>
                  {totalLine && (
                    <span className="font-semibold text-pio-coral">{totalLine}</span>
                  )}
                  {importLine && (
                    <span className="text-sm text-pio-text-muted">{importLine}</span>
                  )}
                </div>
                {(deliveryLine || (showDetailExtras && book.shipsFrom)) && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 pt-3 border-t border-pio-grid text-sm text-pio-text-muted">
                    {deliveryLine && (
                      <span className="inline-flex items-center gap-1.5">
                        <Truck size={15} className="text-pio-teal-dark shrink-0" aria-hidden="true" />
                        {deliveryLine}
                      </span>
                    )}
                    {showDetailExtras && book.shipsFrom && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} className="text-pio-teal-dark shrink-0" aria-hidden="true" />
                        Ships from {book.shipsFrom}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {(type !== 'grid' && !isClickable) && (
              <div className="flex flex-wrap items-center gap-3">
                {type === 'view' && book.sellerType === 'eBay' && (
                  <button
                    type="button"
                    onClick={() => window.open(book.URL, '_blank', 'noopener,noreferrer')}
                    className="flex-1 min-w-[200px] h-[46px] px-6 rounded-full bg-pio-coral text-white text-[15px] font-semibold border-0 cursor-pointer inline-flex items-center justify-center gap-2 transition-colors hover:bg-pio-coral-hover active:bg-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral-dark"
                  >
                    View on eBay
                    <ExternalLink size={16} aria-hidden="true" />
                  </button>
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
                  className={`inline-flex items-center gap-2 h-[46px] px-5 rounded-full text-[15px] font-semibold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral ${cardSaved
                    ? 'bg-pio-coral-pale/40 border border-pio-coral text-pio-coral-dark'
                    : 'bg-white border border-pio-grid text-pio-text hover:bg-pio-bg-light'}`}
                >
                  <Bookmark size={16} fill={cardSaved ? 'currentColor' : 'none'} aria-hidden="true" />
                  {cardSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* COVER CARD — the cover fills a 3:4 frame. */}
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

        {/* BOOK DETAILS CARD — the U12/U12.1 facts list in its own
            card under the cover (eBay aspects only, as before). */}
        {showDetailExtras && detailAspects.length > 0 && (
          <Card
            padded={false}
            className="book-detail-card w-full p-5 sm:p-6 lg:col-start-1 lg:col-span-5 lg:row-start-2"
          >
            <p className="text-sm font-semibold mt-0 mb-2">Book details</p>
            <dl className="my-0">
              {visibleAspects.map((aspect, i) => (
                <div key={`${aspect.name}-${i}`} className="flex text-sm py-0.5">
                  <dt className="text-pio-text-muted w-[110px] shrink-0">{aspect.name}</dt>
                  <dd className="flex-1 min-w-0 m-0">{aspect.value}</dd>
                </div>
              ))}
            </dl>
            {detailAspects.length > 3 && (
              <button
                type="button"
                onClick={() => setDetailsExpanded((open) => !open)}
                aria-expanded={detailsExpanded}
                className="flex items-center gap-1 mt-2 p-0 bg-transparent border-0 cursor-pointer text-sm font-medium text-pio-coral"
              >
                {detailsExpanded ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                {detailsExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </Card>
        )}
      </div>
    );
  }

  // U16: list cards share the first-search cards' shell and hover
  // (see BookCard.css): the clickable modifier class carries the
  // lift + coral border + title color shift, and `group` drives the
  // footer CTA's arrow nudge. The old hover — a flat light-green
  // wash (pio-teal-dark at 14%) on the inner div — is gone.
  return (
    <Card
      padded={false}
      className={`${isSingle ? 'book-single-card' : 'book-list-card'} ${!isSingle && isClickable ? 'book-list-card--link' : ''} group w-full h-full`}
    >
      <div
        className={`flex text-left w-full h-full ${isSingle ? '' : 'p-3'} ${isClickable ? 'cursor-pointer' : ''}`}
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
            {/* U18: list-mode title drops one step (md/text-lg →
                sm/text-base) — Juan: the card content type read too
                big. The detail view's headline is a separate branch
                above and keeps its size. */}
            <Title size="sm" className="book-list-card-title leading-tight mb-2">
              {book.title}
            </Title>
            {book.authors?.length ? (
              <p className="my-1">Authors: {book.authors.join(', ')}</p>
            ) : null}
            {/* U12: eBay catalog product rating — only when eBay matched
                the listing to a catalog product (often absent).
                U12.1: hasRating also excludes the empty 0.0/no-reviews
                rating object eBay sometimes returns. */}
            {hasRating && (
              <RatingStars rating={book.rating} />
            )}
            {(type === 'view' || type === 'grid') && (
              <>
                {/* U3 / D3: condition appears ONCE — the pill below. The
                    old "Condition: Good" text line duplicated it on the
                    deals, detail, and Saved Books screens. */}
                {/* U18: the seller line drops below the title —
                    text-sm in the muted token, quieter but still
                    readable (Juan's review of the card type). */}
                <p className="my-1 text-sm text-pio-text-muted">Sold by: {book.sellerName} ({book.sellerType})</p>
                {/* U12: seller trust — feedback summary under the Sold by
                    line, Top Rated pill beside the condition badge. */}
                {showDetailExtras && book.sellerFeedbackPercentage && (
                  <p className="my-1 text-sm text-pio-text-muted">
                    {`${book.sellerFeedbackPercentage}% positive`}
                    {feedbackScoreText ? ` (${feedbackScoreText} feedback)` : ''}
                  </p>
                )}
                {/* U16: in list mode (grid) the condition pill moves
                    to the card footer, under the separator line —
                    see the footer block below. */}
                {book.condition && type !== 'grid' && (
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
            {/* U16: in list mode (grid) the price moves to the
                footer row beside the condition pill. */}
            {type !== 'form' && type !== 'grid' && (
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
                  {visibleAspects.map((aspect, i) => (
                    <div key={`${aspect.name}-${i}`} className="flex text-sm py-0.5">
                      <dt className="text-pio-text-muted w-[110px] shrink-0">{aspect.name}</dt>
                      <dd className="flex-1 min-w-0 m-0">{aspect.value}</dd>
                    </div>
                  ))}
                </dl>
                {/* U12.1: with more than 3 facts, the rest hide behind
                    this toggle — no toggle at all when there are ≤3. */}
                {detailAspects.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setDetailsExpanded((open) => !open)}
                    aria-expanded={detailsExpanded}
                    className="flex items-center gap-1 mt-2 p-0 bg-transparent border-0 cursor-pointer text-sm font-medium text-pio-coral"
                  >
                    {detailsExpanded ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                    {detailsExpanded ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            )}
          </div>
          {/* U16: the LIST-mode footer (deals page + Books Saved,
              which share this grid rendering). Juan's reference puts
              the condition and price below a thin separator, with
              actions under them — kept understated: the hairline is
              the grid tone at 60% (the U15 header line), the badge
              is the same small Lienzo pill, the price a plain
              semibold line, not a Title. mt-auto pins the footer to
              the card's bottom edge so the U8 equal-height rows line
              their footers up. The actions row carries only the
              "View deal" CTA: list cards have never had a save
              action (the bookmark lives on the detail view, above),
              so none is invented here. The CTA mirrors the search
              cards' "Find deals" (coral, arrow nudging on hover) and
              runs the same navigation as the card click;
              stopPropagation keeps it to exactly one navigation. */}
          {type === 'grid' && (
            <div className="mt-auto px-3 pb-3">
              <div className="flex items-center justify-between gap-2 border-t border-pio-grid/60 pt-2.5 min-h-[30px]">
                {book.condition ? (
                  <Badge label={book.condition} tone="teal" />
                ) : (
                  <span />
                )}
                {book.price !== undefined && book.price !== null && (
                  <span className="text-sm font-semibold tabular-nums text-pio-coral-dark">
                    {/* U18: list-mode prices drop the currency code
                        ("$6.00", not "$6.00 USD") — symbol and
                        amount formatting unchanged. The detail
                        price box keeps the code. */}
                    {`$${book.price}`}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end mt-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
                  className="inline-flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer text-sm font-semibold text-pio-coral transition-colors hover:text-pio-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
                >
                  View deal
                  <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
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
