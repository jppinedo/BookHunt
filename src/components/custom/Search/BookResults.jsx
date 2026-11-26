import React from 'react';
import { Card, Title } from '@jppinedo/lienzo';
import { truncateText } from '@utils/search-utils.js';
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
 * D2 polish: an optional result-count line ("N results for "query"")
 * gives the grid a header; cards get one consistent interior (16px
 * padding, 16px gap), a true 2:3 cover at a responsive size, muted
 * token-colored metadata, and a 3-line clamped description — replacing
 * the ad-hoc grays and the old phone rule that stretched covers to
 * `width: inherit`.
 */
const BookResults = ({ books, onClickItem, query }) => {
  if (!books.length) return null;
  return (
    <div className="w-full px-3 pb-32">
      <div className="max-w-[1100px] mx-auto pt-5">
        {query ? (
          <p className="text-left text-sm text-pio-text-muted px-1 pb-4 m-0">
            <span className="font-semibold text-pio-text">
              {books.length} {books.length === 1 ? 'result' : 'results'}
            </span>
            {' '}for <span className="text-pio-text">&ldquo;{query}&rdquo;</span>
          </p>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {books.map((book) => (
            <Card
              key={`${book.id}-${book.etag}`}
              padded={false}
              className='book-card w-full max-w-[348px] cursor-pointer'
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
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-[104px] h-[156px] sm:w-[120px] sm:h-[180px] object-cover shrink-0 rounded-[10px] bg-pio-bg-light"
                />
                <div className="flex flex-col min-w-0 py-0.5">
                  <Title size="sm" className='book-card-title leading-snug line-clamp-2'>
                    {book.title}
                  </Title>
                  <p className="text-[13px] text-pio-text-muted mt-1.5 line-clamp-1">
                    by {Array.isArray(book.authors) && book.authors.length ? book.authors.join(', ') : 'Unknown author'}
                  </p>
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
