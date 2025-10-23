import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Programmatic navigation to home after login
    navigate('/');
    // Trigger auth change event
    window.dispatchEvent(new Event('authChange'));
  };

  const handleSwitchToRegister = () => {
    // Programmatic navigation to register page
    navigate('/register');
  };

  const handleBackToHome = () => {
    // Programmatic navigation to home
    navigate('/');
  };

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onSwitchToRegister={handleSwitchToRegister}
      onBackToHome={handleBackToHome}
    />
  );
};

export default LoginPage;

