import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { UserContextProvider } from './Components/UserContext';
import Layout from './Routes/layout/Layout';
import IndexPage from './Routes/home/Index';
import LoginPage from './Routes/Authentication/Login/LoginPage';
import RegisterPage from './Routes/Authentication/Signup/RegisterPage';
import { CartContextProvider } from './Components/CartContext';
import Cart from './Routes/cart';
import Orders from './Routes/Orders';

function App() {
  return (
    <UserContextProvider>
      <CartContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Routes>
      </CartContextProvider>
    </UserContextProvider>
  );
}

export default App;
