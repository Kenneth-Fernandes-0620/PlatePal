import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { UserContextProvider } from './UserContext';
import Layout from './Layout';
import IndexPage from './Routes/home/IndexPage';
import LoginPage from './Routes/Authentication/Login/LoginPage';
import RegisterPage from './Routes/Authentication/Signup/RegisterPage';
import FoodPage from './Routes/FoodItem/FoodPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Food/:id" element={<FoodPage />} />
        </Route>
      </Routes>
    </UserContextProvider >
  );
}

export default App;
