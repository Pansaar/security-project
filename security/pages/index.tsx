"use client"
import React, { useState } from 'react';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        // Login successful
        console.log('Login successful');
      } else {
        // Login failed
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        </div>
        <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">SIGN UP</a> here!</p>
    </div>
  );
};

export default Auth;
