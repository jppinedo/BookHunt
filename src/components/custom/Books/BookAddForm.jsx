import React, { useState } from "react";
import { isValidUSD, formatUSD } from "@utils/common-utils";
import { Button, Card, Input, Label, Title } from '@jppinedo/lienzo';

const CONDITION_OPTIONS = ["Brand new", "Very good", "Good", "Readable"];

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
 */
const BookAddForm = ({ book, onSaveBook }) => {

  const [currentPrice, setCurrentPrice] = useState(book.price);
  const [bookCondition, setBookCondition] = useState('');
  const [priceError, setPriceError] = useState(false);
  const [conditionError, setConditionError] = useState(false);

  const handlePriceChange = (e) => {
    setCurrentPrice(e.target.value)
  }

  const handlePriceBlur = () => {
    setCurrentPrice(formatUSD(currentPrice));
  }

  const handleSaveBook = () => {
    if (!isValidUSD(currentPrice)) {
      setPriceError(true);
    }
    if (!bookCondition) {
      setConditionError(true);
    }
    if (currentPrice && bookCondition) {
      onSaveBook({ ...book, ...{ price: currentPrice, condition: bookCondition } });
    }
  }

  return (
    <Card className="min-w-[300px] w-full text-left mt-4">
      <Title size="sm" color="coral">Add more details:</Title>

      <div className="mt-4" onBlur={handlePriceBlur}>
        <Input
          label="Price"
          placeholder="0.00"
          value={currentPrice ?? ''}
          onChange={handlePriceChange}
          hint={priceError ? 'Price is required' : `Amount in ${book.currency || 'USD'} ($)`}
        />
      </div>

      <div className="mt-4">
        <Label text="Condition" />
        <select
          aria-label="Book condition"
          value={bookCondition}
          onChange={(e) => setBookCondition(e.target.value)}
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
        <Button label="Sell Book" onClick={handleSaveBook} />
      </div>
    </Card>
  )
}

export default BookAddForm;
