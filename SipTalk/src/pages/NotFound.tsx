import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Programmatic navigation to home
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist.
          <br />
          How about a cup of coffee instead?
        </p>
        <button className="not-found-button" onClick={handleGoHome}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

