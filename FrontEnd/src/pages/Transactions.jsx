import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Paper, Button } from '@mui/material';
import SideBar from '../components/SideBar';
import Navbar from '../components/Navbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import '../App.css';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [openComplete, setOpenComplete] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/seller/transactions', {
            params: { id: localStorage.getItem('id') },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        }).then(response => {
            setTransactions(response.data);
        }).catch(error => {
            console.error('Error fetching transactions:', error);
        });
    }, []);

    const handleComplete = (transactionId) => {
        setSelectedTransaction(transactionId);
        setOpenComplete(true);
    };

    const handleCancel = (transactionId) => {
        setSelectedTransaction(transactionId);
        setOpenCancel(true);
    };

    const completeTransaction = () => {
        axios.delete(`http://localhost:8080/api/buy/delete/${selectedTransaction}`, {
            withCredentials: true,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        }).then(() => {
            setTransactions(transactions.filter(t => t.buyId!== selectedTransaction));
            setOpenComplete(false);
            setSelectedTransaction(null);
        }).catch(error => {
            console.error('Error completing transaction:', error);
        });
    };

    const cancelTransaction = () => {
        axios.delete(`http://localhost:8080/api/buy/delete/${selectedTransaction}`, {
            withCredentials: true,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        }).then(() => {
            setTransactions(transactions.filter(t => t.buyId !== selectedTransaction));
            setOpenCancel(false);
            setSelectedTransaction(null);
        }).catch(error => {
            console.error('Error canceling transaction:', error);
        });
    };

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
                                Transactions
                            </Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, maxHeight: 'calc(100vh - 250px)' }}>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <TransactionItem
                                            key={transaction.buyId}
                                            transaction={transaction}
                                            onComplete={handleComplete}
                                            onCancel={handleCancel}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>No transactions found.</Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Dialog open={openComplete} onClose={() => setOpenComplete(false)}>
                <DialogTitle>Do you want to complete this transaction?</DialogTitle>
                <DialogContent>
                    <DialogContentText>You can't undo this operation.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenComplete(false)} variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button onClick={completeTransaction} variant="contained" color="success">
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
                <DialogTitle>Do you want to cancel this transaction?</DialogTitle>
                <DialogContent>
                    <DialogContentText>You can't undo this operation.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCancel(false)} variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button onClick={cancelTransaction} variant="contained" color="success">
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

function TransactionItem({ transaction, onComplete, onCancel }) {
    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                    <Box
                        component="img"
                        src={transaction.image ? `data:image/jpeg;base64,${transaction.image}` : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
                        alt={transaction.productName}
                        sx={{ width: '100%', height: 'auto', borderRadius: 1, maxWidth: 100 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{transaction.productName}</Typography>
                    <Typography variant="body2">Quantity: {transaction.quantity} pcs</Typography>
                    <Typography variant="body2">Buyer: {transaction.customerName}</Typography>
                    <Typography variant="body2">Total: P {transaction.total}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" onClick={() => onComplete(transaction.buyId)} color="success">
                        Complete
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => onCancel(transaction.buyId)}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
