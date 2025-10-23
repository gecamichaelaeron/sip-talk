import React, { useState } from 'react';
import '../styles/Register.css';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
  onBackToHome?: () => void;
}

// Toggle this to use PHP backend or localStorage
const USE_BACKEND_API = false;
const API_ENDPOINT = '/register.php'; // Your PHP backend endpoint

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin, onBackToHome }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const registerWithBackend = async () => {
    // Register using PHP backend (with MySQL database)
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    const text = await response.text();
    
    // PHP returns HTML with script tags, extract the message
    if (text.includes('Registration successful')) {
      alert('✅ Registration successful! Please log in.');
      onRegisterSuccess();
    } else if (text.includes('Email already registered')) {
      alert('❌ Email already registered. Try logging in.');
      onSwitchToLogin();
    } else {
      throw new Error('Registration failed');
    }
  };

  const registerWithLocalStorage = () => {
    // Register using localStorage (for development/demo)
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Check if email already exists
    if (users.find((u: any) => u.email === email)) {
      alert('❌ Email already registered. Try logging in.');
      onSwitchToLogin();
      return;
    }

    // Add new user (in production, password should be hashed on backend)
    const newUser = {
      id: Date.now(),
      fullname,
      email,
      password, // In production, this is hashed using password_hash() on backend
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(users));

    alert(`✅ Registration successful! Please log in.`);
    onRegisterSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        alert('❌ Passwords do not match!');
        setLoading(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        alert('❌ Password must be at least 6 characters long!');
        setLoading(false);
        return;
      }

      // Use backend API or localStorage based on configuration
      if (USE_BACKEND_API) {
        await registerWithBackend();
      } else {
        registerWithLocalStorage();
      }

      // Reset form
      setFullname('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 6 characters)"
            required
            minLength={6}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
            Login here
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

export default Register;

