"use client"
import React, { useState } from 'react';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/api/addToDb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        // Login successful
        console.log('Inserting credentials successful');
      } else {
        // Login failed
        console.log('Inserting credentials failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  return (
    <div>
      <h1>Sign up</h1>
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
        <button type="submit">Sign up</button>
      </form>
      <p>Already have an account? <a href="/">LOGIN</a> here!</p>
    </div>
  );
};

export default Auth;
