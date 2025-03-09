import React from 'react';
import { Grid2, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { truncateText } from '@utils/search-utils';
import './BookResults.css';

const BookResults = ({ books, onClickItem }) => {
  return (
    <Grid2 container sx={{ pt: 3, maxWidth: '1600px' }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {books.map((book) => (
        <Card key={`${book.id}-${book.etag}`} sx={{ display: 'flex', padding: 1 }} className='book-card' tabIndex={0} onClick={() => onClickItem(book)}>
          <CardMedia
            component="img"
            sx={{ width: 130, height: 200 }}
            image={book.thumbnail}
            alt={book.title}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 300, textAlign:'left'}}>
            <CardContent sx={{ flex: '0 1 auto', paddingTop: 0  }}>
              <Typography component="div" variant="h6" sx={{lineHeight: 1.1}} className='book-card-title'>
                {book.title}
              </Typography>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: 'text.secondary' }}
              >
                <strong>Author(s):</strong> {Array.isArray(book.authors) ? book.authors?.join(', ') : 'Unknown'}
              </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'left', pl: 2, pb: 1 }}>
              <Typography className='book-card-description'>
                {truncateText(book.description, 200)}
              </Typography>
            </Box>
          </Box>
          
        </Card>
      ))}
    </Grid2>
  );
};

export default BookResults;

