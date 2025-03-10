import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const MenuNav = () => {

  const [anchorEl, setAnchorEl] = useState(null); 
  const open = Boolean(anchorEl);

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
          <MenuItem component={Link} to="/search" onClick={handleMenuClose}>
            Search
          </MenuItem>
          <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
            Login
          </MenuItem>
        </Menu>

    </AppBar>
  )
}

export default MenuNav;
