import React from 'react';
import { useNavigate } from 'react-router-dom';
import Reservation from '../components/Reservation';

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Programmatic navigation back to home
    navigate('/');
  };

  const handleReservationSuccess = () => {
    // Navigate to home after successful reservation
    navigate('/');
  };

  const handleLoginRequired = () => {
    // Navigate to login if user is not authenticated
    navigate('/login');
  };

  return (
    <Reservation
      onBack={handleBack}
      onReservationSuccess={handleReservationSuccess}
      onLoginRequired={handleLoginRequired}
    />
  );
};

export default ReservationPage;

