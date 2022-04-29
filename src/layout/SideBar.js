import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import SummarizeSharpIcon from '@mui/icons-material/SummarizeSharp';

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
        <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            <Link to="/products">
                <ListItem button>
                    <ListItemIcon>
                        <SummarizeSharpIcon />
                    </ListItemIcon>
                    Products
                </ListItem>
            </Link>
            <Link to="/orders">
                <ListItem button>
                    <ListItemIcon>
                        <SummarizeSharpIcon />
                    </ListItemIcon>
                    Orders
                </ListItem>
            </Link>
        </List>
    </Drawer>
    )
}

export default SideBar