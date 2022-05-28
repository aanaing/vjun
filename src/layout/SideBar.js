import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import SummarizeSharpIcon from '@mui/icons-material/SummarizeSharp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import AccessAlarmsTwoToneIcon from '@mui/icons-material/AccessAlarmsTwoTone';

import{ Box, Avatar } from '@mui/material'
import logo from '../static/logo192.png'

import { Link } from 'react-router-dom';
const drawerWidth = 340;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const SideBar = ({ handleDrawerClose, open }) => {

    const theme = useTheme();

    return (
    <Drawer
        sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
        },
        }}
        variant="persistent"
        anchor="left"
        open={open}
    >
        <DrawerHeader sx={{ }} >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} >
                <Avatar alt="V.Jun" src={logo} className='nav-logo' />
            </Box>
            {/* <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton> */}
        </DrawerHeader>
        {/* <Divider /> */}
        <List className='nav-list' >
            <Link to="/orders" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                       <ShoppingCartIcon className='nav-link-icon'/>
                    </ListItemIcon>
                    Orders
                </ListItem>
            </Link>
            <Link to="/products" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <LocalOfferIcon className='nav-link-icon' />
                    </ListItemIcon>
                    Products
                </ListItem>
            </Link>
            <Link to="/loyalty_products" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <LoyaltyIcon className='nav-link-icon' />
                    </ListItemIcon>
                    Loyalty Products
                </ListItem>
            </Link>
            <Link to="/claimed_histories" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <SummarizeSharpIcon className='nav-link-icon' />
                    </ListItemIcon>
                    Claimed Histories
                </ListItem>
            </Link>
            <Link to="/users" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <AccountCircleIcon className='nav-link-icon'/>
                    </ListItemIcon>
                    Users
                </ListItem>
            </Link>
            <Link to="/categories" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <ShoppingBasketIcon className='nav-link-icon'/>
                    </ListItemIcon>
                    Categories
                </ListItem>
            </Link>
            <Link to="/brands" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <VerifiedIcon className='nav-link-icon'/>
                    </ListItemIcon>
                    Brands
                </ListItem>
            </Link>
            <Link to="/ads" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <BrokenImageIcon className='nav-link-icon'/>
                    </ListItemIcon>
                    Ads
                </ListItem>
            </Link>
            <Link to="/server_config" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <SettingsIcon className='nav-link-icon'/>
                    </ListItemIcon>
                    Server Config
                </ListItem>
            </Link>
            <Link to="/banking_accounts" className='nav-link'>
                <ListItem button className='nav-btn'>
                    <ListItemIcon>
                        <CreditCardIcon className='nav-link-icon'/>
                    </ListItemIcon>
                    Banking Account
                </ListItem>
            </Link>
        </List>
    </Drawer>
    )
}

export default SideBar