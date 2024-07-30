import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setToken }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isRegister ? '/register' : '/login';
    try {
      const response = await axios.post(`http://localhost:5000${url}`, { email, password });
      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        navigate('/appointments'); // Redirect to the appointments page
      }
    } catch (error) {
      console.error('Authentication failed', error);
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </div>
  );
};

export default Auth;
