import React from "react";
import { 
  Typography,
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  CardActionArea,
  Button, 
  Box } from '@mui/material';

const BookCard = ({ book, type, onCardClick, isSingle }) => {

  const isClickable = typeof onCardClick === 'function';
  const wrapperStyles = {display: 'flex', textAlign: 'left', maxWidth: type === 'grid' ? 560 : 'inherit', p: isSingle ? 0 : 1};

  const handleCardClick = () => {
    if(isClickable) onCardClick(book);
  }

  const CardWrapper = ({ children}) => {
    if(isClickable) return (
      <Card>
        <CardActionArea 
          onClick={handleCardClick}
          sx={{height: '100%', '&:hover': {backgroundColor: '#ddecff'}, ...wrapperStyles }}
        >
          {children}
        </CardActionArea>
      </Card>
    );
    return <Card sx={wrapperStyles}>{children}</Card>
  }

  const BookCardContent = () => (
    <CardContent>
      <Typography variant="h6" sx={{lineHeight: 1.2, mb: 1, fontWeight: 'bold'}}>
        {book.title}
      </Typography>
      {book.authors?.length && (
        <Typography variant="body1">
          Authors: {book.authors.join(', ')}
        </Typography>
      )}
      {(type === 'view' || type === 'grid') && (
        <>
          <Typography variant="body1">
            Condition: {book.condition}
          </Typography>
          <Typography variant="body1">
            Sold by: {book.sellerName} ({book.sellerType})
          </Typography>
        </>
      )}
      {(isSingle && book.description?.length) && (
        <Typography variant="body2" sx={{ mt:1, mb:1 }}>
          {book.description}
        </Typography>
      )}
      {type !== 'form' && (
        <Typography variant="h6" color="primary">
          {`$${book.price} ${book.currency}`}
        </Typography>
      )}
      
        
      
      
    </CardContent>
  )

  const BookCardActions = () => (
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
  )

  return (
    <CardWrapper>
      <CardMedia
        component="img"
        image={book.thumbnail}
        alt={book.title}
        sx={{ width: 'auto', height: '100%', objectFit: "contain", alignSelf: 'flex-start', maxWidth: isSingle ? '290px' : '200px', p: isSingle ? 2 : 0 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <BookCardContent />
        {(type !== 'grid' && !isClickable) && <BookCardActions />}
        
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
    </CardWrapper>
  )
}

export default BookCard;