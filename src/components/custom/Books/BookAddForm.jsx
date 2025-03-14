import React, { useState } from "react";
import { isValidUSD, formatUSD } from "@utils/common-utils";
import { 
  Typography,
  Card, 
  CardContent, 
  CardActions,
  Button, 
  FormHelperText,
  FormControl, 
  InputLabel, 
  InputAdornment, 
  OutlinedInput, 
  Select,
  MenuItem } from '@mui/material';

const BookAddForm = ({ book, onSaveBook }) => {

  const [currentPrice, setCurrentPrice] = useState(book.price);
  const [bookContidion, setBookCondition] = useState('');
  const [priceError, setPriceError] = useState(false);
  const [conditionError, setConditionError] = useState(false);

  const handlePriceChange = (e) => {
    setCurrentPrice(e.target.value)
  }

  const handlePriceBlur = (e) => {
    setCurrentPrice(formatUSD(e.target.value));
  }

  const handleConditionChange = (e) => {
    setBookCondition(e.target.value);
  }

  const handleSaveBook = () => {
    if (!isValidUSD(currentPrice)) {
      setPriceError(true);
    }
    if (!bookContidion) {
      setConditionError(true);
    }
    if (currentPrice && bookContidion) {
      onSaveBook({...book, ...{ price: currentPrice, condition: bookContidion }});
    }
  }

  return (
    <Card sx={{ 
      minWidth: 300, 
      width: '100%', 
      textAlign: 'left', 
      mt:2}}>
      <CardContent sx={{p:2}}>
        {/* show price as input in form mode */}
        <Typography variant="p" color="primary">Add more details:</Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">${book.currency}</InputAdornment>}
            label="Amount"
            value={currentPrice}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
          />
          {priceError && <FormHelperText>Price is required</FormHelperText>}
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="demo-simple-select-label">Condition</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={bookContidion}
            label="Book condition"
            onChange={handleConditionChange}
            required
          >
            <MenuItem value="Brand new">Brand new</MenuItem>
            <MenuItem value="Very good">Very good</MenuItem>
            <MenuItem value="Good">Good</MenuItem>
            <MenuItem value="Readable">Readable</MenuItem>
          </Select>
          {conditionError && <FormHelperText>Condition is required</FormHelperText>}
        </FormControl>
      </CardContent>
      <CardActions sx={{pl:2, pr:2}}>
        <Button
          variant="contained"
          onClick={handleSaveBook}
          target="_blank"
          rel="noopener noreferrer"
        >
          Sell Book
        </Button>
      </CardActions>
    </Card>
  )
}

export default BookAddForm;