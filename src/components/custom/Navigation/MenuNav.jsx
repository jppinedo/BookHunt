import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { auth } from "@/../firebase.js";
import { signOut } from "firebase/auth";

const MenuNav = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    //Should print null once logged out.
    async function handleLogout() {
        try {
            await signOut(auth);
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="absolute" sx={{top:5, right:5, width: 'auto', }}>
        <IconButton
          color="inherit"
          aria-label="menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} to="/login" onClick={handleLogout} sx={{color: "red"}}>
            Logout
          </MenuItem>
          <MenuItem component={Link} to="/sell" onClick={handleMenuClose}>
            Sell Book
          </MenuItem>
        </Menu>
        </AppBar>
    )
}

export default MenuNav;
