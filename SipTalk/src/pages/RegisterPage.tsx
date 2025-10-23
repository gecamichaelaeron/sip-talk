import React from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../components/Register';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    // Programmatic navigation to login after successful registration
    navigate('/login');
  };

  const handleSwitchToLogin = () => {
    // Programmatic navigation to login page
    navigate('/login');
  };

  const handleBackToHome = () => {
    // Programmatic navigation to home
    navigate('/');
  };

  return (
    <Register
      onRegisterSuccess={handleRegisterSuccess}
      onSwitchToLogin={handleSwitchToLogin}
      onBackToHome={handleBackToHome}
    />
  );
};

export default RegisterPage;

