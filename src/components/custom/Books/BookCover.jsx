import React, { useEffect, useState } from "react";

/**
 * BookCover — U3: Google Books covers sometimes 404, which left the
 * browser's broken-image glyph sitting on result cards and book cards
 * (UX audit finding 4). On error — or when there is no source at all —
 * the cover swaps to a locally generated placeholder: an inline SVG
 * data URI in the Lienzo palette (coral-pale ground, the book's initial
 * in a serif face, the Book Hunt wordmark). No external placeholder
 * service is involved, and because the fallback is still an <img>,
 * every existing cover style applies unchanged: the 2:3 sizing and
 * rounded clipping from D2, the BookCard.css media queries, and the
 * object-fit rules.
 *
 * Palette (Lienzo tokens, inlined because an SVG data URI cannot read
 * CSS variables): coral-pale #FCE4E2 → bg-light #F5F2EC gradient,
 * coral #E05A5A hairline, coral-dark #B03434 initial, text-muted
 * #6B7280 wordmark.
 */
export function coverFallbackSrc(title) {
  const first = String(title || '').trim().charAt(0).toUpperCase();
  const initial = /[A-Z0-9]/.test(first) ? first : 'B';
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0' stop-color='#FCE4E2'/><stop offset='1' stop-color='#F5F2EC'/>` +
    `</linearGradient></defs>` +
    `<rect width='400' height='600' fill='url(#g)'/>` +
    `<rect x='18' y='18' width='364' height='564' fill='none' stroke='#E05A5A' stroke-opacity='0.35' stroke-width='2'/>` +
    `<text x='200' y='335' font-family='Georgia, "Times New Roman", serif' font-size='190' fill='#B03434' text-anchor='middle'>${initial}</text>` +
    `<text x='200' y='522' font-family='Georgia, serif' font-size='25' letter-spacing='6' fill='#6B7280' text-anchor='middle'>BOOK HUNT</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const BookCover = ({ src, title, alt, className, style }) => {
  const [failed, setFailed] = useState(false);

  // A recycled card instance can receive a new book — retry its cover.
  useEffect(() => { setFailed(false); }, [src]);

  return (
    <img
      src={!src || failed ? coverFallbackSrc(title) : src}
      alt={alt ?? title ?? ''}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
};

export default BookCover;
