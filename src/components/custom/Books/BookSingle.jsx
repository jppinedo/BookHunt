import React from "react";
import BookCard from "./BookCard";
import BookAddForm from "./BookAddForm";

/**
 * BookSingle — was MUI Container. Now a plain centered column: the
 * BookCard inside is already a Lienzo Card, so wrapping it in a Lienzo
 * Box only stacked a second full panel behind the card.
 */
const BookSingle = ({ type, book }) => {
  return (
    <div className="max-w-3xl mx-auto w-full px-3 pb-32">
      <BookCard book={book} type={type} />
      {/* show form items if adding new book */}
      {type === 'form' && (
        <BookAddForm book={book} />
      )}
    </div>
  );
};

export default BookSingle;
