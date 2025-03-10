import React, { useContext } from "react";
import { useParams } from "react-router";
import { AppContext } from "@state/AppContext";
import { Container, Typography, Grid2 as Grid, Card, CardMedia, CardContent, Button, Link } from '@mui/material';

const BookSinglePage = () => {
    const { type, id } = useParams();
    const { currentBook } = useContext(AppContext);

    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Main Book Details */}
      <Grid container spacing={4}>
        {/* Thumbnail Image */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={currentBook.thumbnail}
              alt={currentBook.title}
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        {/* Title, Price, and Condition */}
        <Grid item xs={12} md={8}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {currentBook.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {currentBook.price} {currentBook.currency}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Condition: {currentBook.condition}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Sold by: {currentBook.sellerName} ({currentBook.sellerType})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href={currentBook.URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
            >
              View on eBay
            </Button>
          </CardContent>
        </Grid>
      </Grid>

      {/* Additional Images Grid */}
      {currentBook.images?.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Images
            </Typography>
          </Grid>
          {currentBook.images.map((image, index) => (
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
      )}
    </Container>
    )
}

export default BookSinglePage;