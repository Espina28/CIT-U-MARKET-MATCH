import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Container, Grid, Box, Typography, Paper, TextField, IconButton, Button, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const brandingImages = [
  '/images/branding1.png',
  '/images/branding2.png',
  '/images/branding3.png',
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUserId = sessionStorage.getItem('id');
  
    axios
      .get('http://localhost:8080/api/user/getAllProducts', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })
      .then((response) => {
        const filteredProducts = response.data.filter(
          (product) => String(product.userId) !== String(currentUserId)
        );
        setProducts(filteredProducts);
        setDisplayedProducts(filteredProducts.slice(0, visibleCount));
      })
      .catch((error) => {
        console.error('There was an error fetching the products!', error);
      });
  }, [visibleCount]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredProducts = products.filter(
      (product) =>
        product.productName &&
        product.productName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  };

  const loadMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  return (
    <div style={{ backgroundColor: '#800000' }}> {/* Set maroon background for homepage */}
      <Navbar />

      {/* Carousel Section for Branding Images */}
      <Box sx={{ backgroundColor: '#f5f5f5', paddingTop: 2 }}>
        <Container maxWidth="xl">
          <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
            {brandingImages.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Branding ${index + 1}`}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              </div>
            ))}
          </Carousel>
        </Container>
      </Box>

      {/* Search Bar */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: 50,
            boxShadow: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="Search for products..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 50, // Rounded corners for input field
              },
            }}
          />
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              backgroundColor: '#800000', // Maroon background color
              color: '#FFD700', // Gold icon color
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: '#660000', // Darker maroon on hover
              },
              padding: 1,
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Container>

      {/* Product Grid */}
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Grid container spacing={5}>
          {displayedProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link
                to={`/product-detail/${product.productId}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    // backgroundColor: '#FFD700',  Gold background color for product card
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      product.image
                        ? `data:image/jpeg;base64,${product.image}`
                        : '/images/placeholder.png'
                    }
                    alt={product.productName || 'Product Image'}
                    sx={{
                      objectFit: 'contain',
                    
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {product.productName || 'Unnamed Product'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {product.productDescription || 'No description available'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', padding: '8px 16px' }}>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      ${product.productPrice}
                    </Typography>
                  </CardActions>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
        {visibleCount < products.length && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" onClick={loadMoreProducts}>
              See More
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default HomePage;
