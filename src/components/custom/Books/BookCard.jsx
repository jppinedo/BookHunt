import React from "react";
import { 
  Typography,
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button, 
  Box } from '@mui/material';

const BookCard = ({ book, type }) => {
  return (
    <Card sx={{ display: 'flex', textAlign: 'left'}}>
      <CardMedia
        component="img"
        image={book.thumbnail}
        alt={book.title}
        sx={{ width: '100%', height: 'auto', maxWidth: '190px', objectFit: "contain", alignSelf: 'flex-start'}}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="h6" sx={{lineHeight: 1.2, mb: 1, fontWeight: 'bold'}}>
              {book.title}
            </Typography>
            {book.authors?.length && (
              <Typography variant="body1">
                Authors: {book.authors.join(', ')}
              </Typography>
            )}
            {/* show condition and seller if in view mode */}
            {type === 'view' && (
              <>
                <Typography variant="body1">
                  Condition: {book.condition}
                </Typography>
                <Typography variant="body1">
                  Sold by: {book.sellerName} ({book.sellerType})
                </Typography>
                <Typography variant="h6" color="primary">
                  {`$${book.price} ${book.currency}`}
                </Typography>
              </>
            )}
        </CardContent>
        <CardActions>
          {type === 'view' && book.sellerType === 'eBay' && (
            <Button
              variant="contained"
              href={book.URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on eBay
            </Button>
          )}
          {type === 'view' && book.sellerType === 'user' &&  (
            <Button
              variant="contained"
              href={`mailto:${book.sellerEmail}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact seller
            </Button>
          )}
        </CardActions>
        {/* Additional Images Grid ...if we have time for this */}
        {/* {type === 'view' && book.images?.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {book.images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    image={image.imageUrl}
                    alt={`Additional Image ${index + 1}`}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        )} */}
      </Box>
    </Card>
  )
}

export default BookCard;