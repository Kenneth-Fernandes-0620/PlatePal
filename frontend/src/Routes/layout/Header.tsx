import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { IconButton, MenuItem, Menu } from "@mui/material";

import { UserContext } from "./UserContext";
import { CartContext } from "./CartContext";
import logo from "../../Assets/logo.jpg";


export default function Header() {
  const userContext = useContext(UserContext);
  const cartContext = useContext(CartContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  if (!userContext || !cartContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { userInfo, setUserInfo } = userContext;
  const { cartInfo } = cartContext;

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl != null)
      setAnchorEl(event.currentTarget);
  };

  // Function to handle closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    }).catch(err => {
      console.log(err);
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    navigate('/');
    window.location.reload();
  }

  const username = userInfo?.email;

  return (
    <header style={{
      display: 'flex',
      background: '#CCC',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: '50px',
      paddingRight: '50px',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
      }}>
        <img src={logo} alt="" height={70} width={70} />
        <h1>
          <Link to="/" className="logo" style={{ textDecoration: 'None', color: 'black', fontStyle: 'italic' }}>FoodPal</Link>
        </h1>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <div>
          <IconButton aria-label="cart" onClick={() => { navigate("/cart") }}>
            <ShoppingCartIcon />{cartInfo?.size}
          </IconButton>
        </div>

        <div>
          <IconButton aria-label="account" onClick={(e) => {
            if (username == null) navigate("/login")
            else
              handleClick(e);
          }}
            onMouseOver={handleClick}
            onMouseOut={handleClose}
          // onMouseLeave={handleClose}

          >
            <AccountCircleIcon />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {/* Menu items */}
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>

      </div>




    </header>
  );
}
