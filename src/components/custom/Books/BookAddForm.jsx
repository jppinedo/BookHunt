import React, { useState } from "react";
import { isValidUSD, formatUSD } from "@utils/common-utils";
import { Button, Card, Input, Label, Title } from '@jppinedo/lienzo';
import { ChevronDown, ChevronUp } from 'react-feather';

export const CONDITION_OPTIONS = ["Brand new", "Very good", "Good", "Readable"];

/**
 * BookAddForm — was MUI Card/FormControl/OutlinedInput/Select/MenuItem.
 * Now: Lienzo Card/Title/Input/Button.
 *
 * DS GAP: Lienzo's Select is uncontrolled — it accepts only `options` and
 * `placeholder`, with no value/onChange — so a form cannot read the chosen
 * condition from it. The condition picker below is therefore a native
 * <select> styled with Tailwind utilities, with a Lienzo Label. Making
 * Select controlled (value + onChange) is the fix on the DS side.
 * Lienzo Input also has no adornment support, so the "$ USD" prefix the
 * MUI version showed is rendered as hint text instead.
 *
 * U4 (audit, Sell finding): the form used to start the price at the book's
 * Google Books price — '0.00' — and an emptied price silently blurred back
 * to '0.00', so a listing could be posted at $0 without the seller ever
 * typing a price. The price now starts EMPTY with a placeholder, is
 * validated (required, > 0) with an inline message, and the submit stays
 * disabled until the selected book carries an ISBN and the price and
 * condition are valid. Field order is Price → Condition → Description:
 * the book's long description used to render in the card ABOVE this form
 * and push it below the fold; it now lives here, last and optional,
 * collapsed behind a toggle (prefilled with the book's description,
 * editable/clearable). Submit is async: onSaveBook throws on failure and
 * the form shows an inline error instead of failing silently.
 *
 * DS GAP: Lienzo Button has no `disabled` prop, so the disabled submit
 * is a wrapper with pointer-events removed + reduced opacity, and
 * handleSaveBook re-checks validity as a second line of defence.
 */
const BookAddForm = ({ book, onSaveBook }) => {

  const [currentPrice, setCurrentPrice] = useState('');
  const [bookCondition, setBookCondition] = useState('');
  const [description, setDescription] = useState(book.description || '');
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [priceError, setPriceError] = useState('');
  const [conditionError, setConditionError] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const priceValid = isValidUSD(currentPrice);
  const canSubmit = Boolean(book.isbn) && priceValid && Boolean(bookCondition) && !submitting;

  const missing = [];
  if (!book.isbn) missing.push('a book with an ISBN');
  if (!priceValid) missing.push('a valid price');
  if (!bookCondition) missing.push('a condition');

  const handlePriceChange = (e) => {
    setCurrentPrice(e.target.value);
    if (priceError) setPriceError('');
  }

  const handlePriceBlur = () => {
    const value = currentPrice.trim();
    if (!value) {
      // U4: an emptied price stays empty (and invalid) — it no longer
      // blurs back to '0.00' behind the seller's back.
      setPriceError('Price is required');
      return;
    }
    if (isValidUSD(value)) {
      setCurrentPrice(formatUSD(value));
      setPriceError('');
    } else {
      setPriceError('Enter a price above $0.00');
    }
  }

  const handleSaveBook = async () => {
    if (!canSubmit) {
      if (!priceValid) setPriceError(currentPrice.trim() ? 'Enter a price above $0.00' : 'Price is required');
      if (!bookCondition) setConditionError(true);
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await onSaveBook({
        ...book,
        price: formatUSD(currentPrice),
        condition: bookCondition,
        description: description.trim(),
      });
      // Success: NewBookPage swaps this form for the confirmation
      // screen, so there is nothing to reset here.
    } catch (error) {
      console.error('Error saving book: ', error);
      setFormError("We couldn't publish your listing. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <Card className="min-w-[300px] w-full text-left mt-4">
      <Title size="sm" color="coral">Add more details:</Title>

      {/* Lienzo Input has no onBlur prop — blur is caught on the
          wrapper (React onBlur bubbles from the inner input). */}
      <div className="mt-4" onBlur={handlePriceBlur}>
        <Input
          label="Price"
          placeholder="0.00"
          value={currentPrice}
          onChange={handlePriceChange}
          hint={priceError || `Amount in ${book.currency || 'USD'} ($)`}
        />
      </div>

      <div className="mt-4">
        <Label text="Condition" />
        <select
          aria-label="Book condition"
          value={bookCondition}
          onChange={(e) => { setBookCondition(e.target.value); setConditionError(false); }}
          required
          className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-base"
        >
          <option value="" disabled>Select an option</option>
          {CONDITION_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {conditionError && <p className="text-sm mt-1">Condition is required</p>}
      </div>

      <div className="mt-4">
        <button
          type="button"
          aria-expanded={descriptionOpen}
          onClick={() => setDescriptionOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-0 py-1 text-left"
        >
          <Label text="Description (optional)" />
          {descriptionOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </button>
        {descriptionOpen && (
          <textarea
            aria-label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Anything a buyer should know — markings, highlights, a bent cover…"
            className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-base"
          />
        )}
      </div>

      {formError && (
        <p role="alert" className="mt-4 text-sm font-medium text-pio-coral-dark">{formError}</p>
      )}

      <div className="mt-4">
        <div
          className={canSubmit ? '' : 'pointer-events-none opacity-50'}
          aria-disabled={!canSubmit}
        >
          {/* U5.1: form submits wear Lienzo's deep teal (type="green")
              at lg padding — the pale default was too easy to miss. */}
          <Button label={submitting ? 'Publishing…' : 'Sell Book'} type="green" size="lg" onClick={handleSaveBook} />
        </div>
        {!canSubmit && !submitting && (
          <p className="text-sm mt-2">Still needed: {missing.join(', ')}.</p>
        )}
      </div>
    </Card>
  )
}

export default BookAddForm;
