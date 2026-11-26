import React from 'react';
import { Card, Title } from '@jppinedo/lienzo';
import { truncateText } from '@utils/search-utils.js';
import BookCover from '@custom/Books/BookCover';
import './BookResults.css';

/**
 * BookResults — was MUI Container + Grid2 + Card/CardMedia/CardContent +
 * Typography. Lienzo has no Grid (DS gap): layout is a plain Tailwind
 * grid; each result is a Lienzo Card.
 *
 * Layout fix: results used to sit inside a Lienzo Box — a full-width
 * cream slab that rendered as a huge empty panel before any search and
 * added a meaningless second container around the cards. The grid now
 * sits directly on the page background; bottom padding keeps the last
 * row clear of the floating hub navigation.
 *
 * D2 polish: cards get one consistent interior (16px padding, 16px
 * gap), a true 2:3 cover at a responsive size, muted token-colored
 * metadata, and a 3-line clamped description — replacing the ad-hoc
 * grays and the old phone rule that stretched covers to `width:
 * inherit`.
 *
 * U1.2: the grid sits in the shared .page-shell container (it used to
 * be a private 1100px wrapper inside px-3, which is exactly why its
 * edges never aligned with the breadcrumb bar's 1200px/px-4 wrapper).
 * The D2 result-count line is gone from here — Juan asked for the
 * count inside the breadcrumb bar; SearchPage passes it to
 * BreadcrumbNav's `end` slot instead.
 *
 * U7: the cards no longer cap at 348px or center in their cells
 * (justify-items-center) — that inset the card block from both edges
 * of the shell the breadcrumb spans, so the bar looked wider than
 * the list, and partial rows floated in the middle. Cards are now
 * w-full of their cell, the grid's default stretch makes each row's
 * cards equal height (the clickable body already carries h-full),
 * and rows fill from the left.
 */
const BookResults = ({ books, onClickItem }) => {
  if (!books.length) return null;
  return (
    <div className="page-shell pb-32">
      <div className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (
            <Card
              key={`${book.id}-${book.etag}`}
              padded={false}
              className='book-card w-full h-full cursor-pointer'
            >
              <div
                className="flex gap-4 p-4 text-left h-full"
                tabIndex={0}
                role="button"
                onClick={() => onClickItem(book)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClickItem(book);
                  }
                }}
              >
                <BookCover
                  src={book.thumbnail}
                  title={book.title}
                  className="w-[104px] h-[156px] sm:w-[120px] sm:h-[180px] object-cover shrink-0 rounded-[10px] bg-pio-bg-light"
                />
                <div className="flex flex-col min-w-0 py-0.5">
                  <Title size="sm" className='book-card-title leading-snug line-clamp-2'>
                    {book.title}
                  </Title>
                  <p className="text-[13px] text-pio-text-muted mt-1.5 line-clamp-1">
                    by {Array.isArray(book.authors) && book.authors.length ? book.authors.join(', ') : 'Unknown author'}
                  </p>
                  {/* U3: muted edition line — year + ISBN (ISBN-13
                      preferred; formatGoogleBook already resolves
                      isbn13 → isbn10 into book.isbn). This is what
                      tells the surviving near-identical editions
                      apart after de-duplication. Missing parts are
                      simply omitted. */}
                  {(book.year || book.isbn) ? (
                    <p className="text-[12.5px] text-pio-text-muted mt-0.5 line-clamp-1">
                      {[book.year, book.isbn ? `ISBN ${book.isbn}` : null].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  <p className='text-[13px] leading-relaxed text-pio-text-muted mt-2 line-clamp-3'>
                    {book.description ? truncateText(book.description, 200) : ''}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookResults;
