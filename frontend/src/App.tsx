import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { UserContextProvider } from './Routes/layout/UserContext';
import Layout from './Routes/layout/Layout';
import IndexPage from './Routes/home/Index';
import LoginPage from './Routes/Authentication/Login/LoginPage';
import RegisterPage from './Routes/Authentication/Signup/RegisterPage';
import FoodPage from './Routes/FoodItem/FoodPage';
import { CartContextProvider } from './Routes/layout/CartContext';
import Cart from './Routes/cart';

function App() {
  return (
    <UserContextProvider>
      <CartContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/Food/:id" element={<FoodPage />} />
            <Route path='/cart' element={<Cart />} />
          </Route>
        </Routes>
      </CartContextProvider>
    </UserContextProvider >
  );
}

export default App;
