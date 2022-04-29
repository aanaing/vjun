import React, { useState, lazy, Suspense, useEffect, createContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert } from '@mui/material'

import Header from '../layout/Header';
import SideBar from '../layout/SideBar';

const Dashboard = lazy(() => import('./Dashboard'));
const Products = lazy(() => import('./products/index'))
const Product = lazy(() => import('./products/Product'))
const Orders = lazy(() => import('./orders/index'))
const Order = lazy(() => import('./orders/Order'))

const drawerWidth = 340;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
  const navigate = useNavigate()
  const AuthContext = createContext()
  const [ auth, setAuth ] = useState(null)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const homeAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError})
    setTimeout(() => {
      setShowAlert({ message: '', isError: false })
    }, 3000)
  }
  
useEffect(() => {
  const loggedUser = window.localStorage.getItem('loggedUser')
  if(loggedUser) {
    const parsedLoggedUser = JSON.parse(loggedUser)
    setAuth(parsedLoggedUser)
  } else {
    navigate('/login')
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header open={open} handleDrawerOpen={handleDrawerOpen} />
    <SideBar handleDrawerClose={handleDrawerClose} open={open} />
        <Main open={open}>
            <DrawerHeader />
            <Suspense fallback={<div>Loading...</div>}>
              <AuthContext.Provider value={auth}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<Product homeAlert={homeAlert} />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/order/:id" element={<Order />} />
                </Routes>
              </AuthContext.Provider>
            </Suspense>
        </Main>
        {
          (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
        }
        {
          (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
        }
    </Box>
  );
}

export default Admin
