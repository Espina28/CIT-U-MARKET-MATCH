import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button, Select, MenuItem, Paper } from '@mui/material';
import SideBar from '../components/SideBar';
import '../App.css';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const cartid = localStorage.getItem("id");

    useEffect(() => {
        axios.get('http://localhost:8080/api/cart/getCart/' + cartid, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
        .then(response => {
            setCartItems(response.data.products);
        })
        .catch(error => {
            console.error('There was an error fetching the cart!', error);
        });
    }, [cartid]);

    const handleBuy = (product) => {
        if (product) {
            const payload = {
                quantity: product.quantity || 1,
                orderDate: new Date().toISOString(),
                total: parseFloat(product.productPrice) * (product.quantity || 1),
                buyer: {
                    buyerId: localStorage.getItem("id"),
                },
                product: {
                    productId: product.productId,
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

    const handleRemoveFromCart = (productId) => {
        const token = localStorage.getItem('token');
        
        axios.delete(`http://localhost:8080/api/cart/${cartid}/product/${productId}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', 
            },
        })
        .then(() => {
            setCartItems(cartItems.filter(item => item.productId !== productId));
        })
        .catch(error => {
            console.error('There was an error removing the product from the cart!', error);
        });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setCartItems(cartItems.map(item => {
            if (item.productId === productId) {
                item.quantity = newQuantity;
            }
            return item;
        }));
    };

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => {
            const itemPrice = parseFloat(item.productPrice) || 0;
            const itemQuantity = item.quantity || 1;
            const itemTotal = itemPrice * itemQuantity;
            return sum + itemTotal;
        }, 0);
        setTotalCartPrice(total.toFixed(2));
    }, [cartItems]);

    return (
        <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ flexGrow: 1, display: 'flex', padding: 4 }} className="padding-color-outer">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3} lg={2.5}>
                        <SideBar />
                    </Grid>
                    <Grid item xs={12} md={9} lg={9.5}>
                        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h5" sx={{ p: 2, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                                MY PURCHASE
                            </Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, maxHeight: 'calc(100vh - 250px)' }}>
                                {cartItems.length > 0 ? (
                                    cartItems.map((product) => (
                                        <CartItem 
                                            key={product.productId} 
                                            product={product} 
                                            onRemoveFromCart={handleRemoveFromCart} 
                                            onQuantityChange={handleQuantityChange}
                                            onBuy={() => handleBuy(product)}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>Your cart is empty.</Typography>
                                )}
                            </Box>
                            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Total Price:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    ${totalCartPrice}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

const CartItem = ({ product, onRemoveFromCart, onQuantityChange, onBuy }) => {
    const [quantity, setQuantity] = useState(product.quantity || 1);
    const imageUrl = product.image ? `data:image/jpeg;base64,${product.image}` : '';

    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10));
        setQuantity(newQuantity);
        onQuantityChange(product.productId, newQuantity);
    };

    const totalPrice = (parseFloat(product.productPrice) * quantity).toFixed(2);

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2, position: 'relative' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                    <Box
                        component="img"
                        src={imageUrl}
                        alt={product.productName}
                        sx={{ width: '100%', height: 'auto', borderRadius: 1, maxWidth: 100 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{product.productName}</Typography>
                    <Typography variant="body2">Price: ${parseFloat(product.productPrice).toFixed(2)}</Typography>
                    <Box sx={{ mt: 1 }}>
                        <Select
                            value={quantity}
                            onChange={handleQuantityChange}
                            size="small"
                            sx={{ minWidth: 60 }}
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <MenuItem key={num} value={num}>{num}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total: ${totalPrice}</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" onClick={onBuy} sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}>
                        BUY NOW
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => onRemoveFromCart(product.productId)}>
                        REMOVE
                    </Button>
                </Grid>
            </Grid>
            <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}>
                {product.dateAdded}
            </Typography>
        </Paper>
    );
};

export default Cart;

