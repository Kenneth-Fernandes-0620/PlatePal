import React, { FC, useState } from 'react';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import img from '../../../Assets/Group 23.png';
import {
  validateEmail,
  validatePassword,
  validateRepeatPassword,
} from '../../../util/Validators';
import { VisibilityOff, Visibility } from '@mui/icons-material';

const RegisterPage: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const navigate = useNavigate();

  function togglePasswordVisibility(): void {
    setShowPassword(!showPassword);
  }

  function togglRepeatPasswordVisibility(): void {
    setShowRepeatPassword(!showRepeatPassword);
  }

  function handleLogin() {
    const emailValidationResult = validateEmail(email);

    if (!emailValidationResult) {
      alert('Invalid email');
      return;
    }

    const passwordValidationResult = validatePassword(password);

    if (!passwordValidationResult) {
      alert('Invalid password');
      return;
    }

    const repeatPasswordValidationResult = validateRepeatPassword(
      password,
      repeatPassword,
    );

    if (!repeatPasswordValidationResult) {
      alert('The two Passwords do not match');
      return;
    }

    fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Email or password is Wrong');
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        if (error.message === 'Email or password is Wrong') {
          alert(error.message);
        }
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
        <h1 style={{ textAlign: 'center' }}>Register</h1>
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
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </Button>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            <input
              type={showRepeatPassword ? 'text' : 'password'}
              placeholder="Re-enter Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
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
              onClick={togglRepeatPasswordVisibility}
            >
              {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
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
            to="/login"
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            Already have an account? Login
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

export default RegisterPage;
