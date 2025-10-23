import React, { useState } from 'react';
import '../styles/Login.css';
import { loginUser } from '../utils/auth';

interface LoginProps {
  onLoginSuccess: (user: { fullname: string; email: string }) => void;
  onSwitchToRegister: () => void;
  onBackToHome?: () => void;
}

// Toggle this to use PHP backend or localStorage
const USE_BACKEND_API = false;
const API_ENDPOINT = '/login.php'; // Your PHP backend endpoint

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loginWithBackend = async () => {
    // Login using PHP backend (with MySQL database)
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
      credentials: 'include' // Include cookies for session management
    });

    const text = await response.text();
    
    // PHP returns HTML with script tags, extract the message
    if (text.includes('Login successful')) {
      // Extract fullname from alert message
      const match = text.match(/Welcome, ([^']+)/);
      const fullname = match ? match[1] : 'User';
      
      // Store session info
      loginUser({
        id: Date.now(), // In real scenario, get this from backend
        fullname: fullname,
        email: email
      });

      alert(`✅ Login successful! Welcome, ${fullname}`);
      
      onLoginSuccess({ fullname, email });
    } else if (text.includes('Incorrect password')) {
      alert('❌ Incorrect password. Try again.');
    } else if (text.includes('Email not registered')) {
      alert('❌ Email not registered. Please sign up first.');
      onSwitchToRegister();
    } else {
      throw new Error('Login failed');
    }
  };

  const loginWithLocalStorage = () => {
    // Login using localStorage (for development/demo)
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      alert('❌ Email not registered. Please sign up first.');
      onSwitchToRegister();
      return;
    }

    // In production, password verification should be done on the backend
    if (user.password !== password) {
      alert('❌ Incorrect password. Try again.');
      return;
    }

    // Store session info using auth utility
    loginUser({
      id: user.id,
      fullname: user.fullname,
      email: user.email
    });

    alert(`✅ Login successful! Welcome, ${user.fullname}`);
    
    onLoginSuccess({
      fullname: user.fullname,
      email: user.email
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use backend API or localStorage based on configuration
      if (USE_BACKEND_API) {
        await loginWithBackend();
      } else {
        loginWithLocalStorage();
      }

    } catch (error) {
      console.error('Login error:', error);
      alert('❌ An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>
            Register here
          </a>
        </p>
        {onBackToHome && (
          <p>
            <a href="#" onClick={(e) => { e.preventDefault(); onBackToHome(); }}>
              ← Back to Home
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

