import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import img from '../../../Assets/login.png';
import { validateEmail, validatePassword } from '../../../util/Validators';
import { UserContext } from '../../../Components/UserContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();

  const context = useContext(UserContext);

  if (!context) {
    throw new Error('SomeComponent must be used within a UserContextProvider');
  }

  const { setUserInfo } = context;

  function togglePasswordVisibility(): void {
    setShowPassword(!showPassword);
  }

  function handleLogin() {
    const emailValidationResult = validateEmail(email);

    if (!emailValidationResult) {
      alert('Invalid email, check it again');
      return;
    }

    const passwordValidationResult = validatePassword(password);

    if (!passwordValidationResult) {
      alert(
        'Invalid password, it should be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number and one special character',
      );
      return;
    }

    fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Email or password is Wrong, or does not exist');
      })
      .then((data) => {
        setUserInfo(data);
        navigate('/');
      })
      .catch((error) => {
        alert(error.message);

        console.error(error);
      });
  }

  return (
    <div
      style={{
        display: 'flex',
        padding: '50px',
      }}
    >
      <form
        style={{
          flex: 2,
          margin: '10px',
          padding: '20px',
          border: '1px solid #000',
          borderRadius: '5px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '10px',
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #000',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '90%',
                padding: '10px',
                marginRight: '10px',
                border: '1px solid #000',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            />
            <Button
              type="button"
              variant="contained"
              sx={{
                flex: 1,
              }}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide ' : 'Show'}
            </Button>
          </div>
          <Button type="button" variant="contained" onClick={handleLogin}>
            Sign In
          </Button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
            Forgot password?
          </a>
          <br />
          <Link
            to="/register"
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            Don&apos;t have an account? Signup
          </Link>
        </div>
      </form>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={img}
          alt="Food image"
          style={{ width: '100%', height: 'auto', maxWidth: '500px' }} // Ensure image scales well
        />
      </div>
    </div>
  );
};

export default LoginPage;
