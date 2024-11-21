 import React, { useState , useEffect} from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import axios from 'axios';
import '../App.css'; // Custom CSS

export default function ProductLayout() {
    const location = useLocation();
    const [userData, setUserData] = useState();
    
    const [products, setProducts] = useState([]);
    const { productId } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8080/api/user/getProducts/' + productId,{
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(response => {
                setProducts(response.data);
                console.log("Prdoucts:",response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    const imageUrl = products.image ? `data:image/jpeg;base64,${products.image}` : '';

    const handleAddToCart = () => {
        if (products) {
            const cartId = localStorage.getItem("id"); // Retrieve cart ID from session

            axios.post(`http://localhost:8080/api/cart/addProduct/${cartId}/${productId}`,{}, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              },
            })
              .then(response => {
                console.log(response.data);
                alert("Product added to cart successfully!");
              })
              .catch(error => {
                console.error("Error adding product to cart", error);
              });
          } else {
            console.log("Products data is not yet available. Please try again.");
          }
      };

      const handleBuy = () => {
        if (products) {
            const payload = {
                quantity: 1, 
                orderDate: new Date().toISOString(), 
                total: parseFloat(products.productPrice),
                buyer: {
                    buyerId: localStorage.getItem("id"), 
                },
                product: {
                    productId: productId, 
                },
            };
    
            axios.post('http://localhost:8080/api/buy/create', payload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then(response => {
                console.log("Purchase successful:", response.data);
                alert("Purchase successful!");
            })
            .catch(error => {
                console.error("Error during purchase:", error);
                alert("Failed to complete the purchase. Please try again.");
            });
        } else {
            console.log("Product data is not available yet. Please wait.");
        }
    };

    return (
        <Container maxWidth={false} disableGutters sx={{ height: '91.4vh', padding: 0 }}>
            <Navbar />

            {/* Main Content */}
            <Grid container direction="row" wrap="nowrap" sx={{ height: '100%', backgroundColor: '#7D0C0E', padding: 2 }}>
                <Grid item md={1} sx={{ backgroundColor: 'white', padding: 4, borderRadius: '8px', height: '100%', width: '100%' }}>
                    <Grid container spacing={10}>
                        <Grid container direction={'column'} spacing={3}>
                            {/* Product Image */}
                            <Grid item xs={12} md={6}>
                                 {imageUrl && <img src={imageUrl} alt="Product" style={{ width: '630px', height: '400px', backgroundColor: '#E0E0E0', border: '1px solid #00BFFF', borderRadius: '8px' }} />}
                            </Grid>
                            {/* Similar Products */}
                            <Grid container spacing={10}>
                                <Card>
                                    <Grid container xs={6} md={3} spacing={2}>
                                        <Grid container direction={'column'}>
                                        <Box
                                            sx={{
                                                width: '100px',
                                                height: '100px',
                                                backgroundColor: '#E0E0E0',
                                                border: '1px solid #7D0C0E',
                                                borderRadius: '8px',
                                                marginTop: 2,
                                                marginLeft: 2,
                                                marginBottom: 2,
                                            }}
                                        />
                                        </Grid>
                                        <Grid container direction={'column'} marginTop={3}marginRight={3}>
                                            <Typography variant="body2" align="center">PRODUCT NAME</Typography>
                                            <Typography variant="h6" align="center" sx={{ color: '#7D0C0E', fontWeight: 'bold' }}>
                                                PRICE
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
                                <Card>
                                    <Grid container xs={6} md={3} spacing={2}>
                                        <Grid container direction={'column'}>
                                        <Box
                                            sx={{
                                                width: '100px',
                                                height: '100px',
                                                backgroundColor: '#E0E0E0',
                                                border: '1px solid #7D0C0E',
                                                borderRadius: '8px',
                                                marginTop: 2,
                                                marginLeft: 2
                                            }}
                                        />
                                        </Grid>
                                        <Grid container direction={'column'} marginTop={3}marginRight={3}>
                                            <Typography variant="body2" align="center">PRODUCT NAME</Typography>
                                            <Typography variant="h6" align="center" sx={{ color: '#7D0C0E', fontWeight: 'bold' }}>
                                                PRICE
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        </Grid>
                        {/* Product Details */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{products.productName}</Typography>
                            <Typography variant="h5" sx={{ color: '#7D0C0E', fontWeight: 'bold', marginTop: 2 }}>
                                P{products.productPrice}
                            </Typography>
                            <Divider sx={{ margin: '10px 0', borderColor: 'black' }} />
                            <Typography variant="body1" paragraph width={'600px'}>
                                {products.productDescription}
                            </Typography>
                            
                            <Divider sx={{ margin: '10px 0', borderColor: 'black' ,marginTop: '45%'}} />
                            {/* Action Buttons */}
                            <Grid container spacing={2} direction={'column'}>
                                <Grid container direction={'row'}>
                                    <Grid item marginLeft={10} marginRight={8}>
                                        <Button variant="contained" onClick={handleBuy} sx={{ backgroundColor: 'black', color: 'white',padding: '15px 50px' }}>Buy Now</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" onClick={handleAddToCart} sx={{padding: '15px 50px' }}>Add to Cart</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
