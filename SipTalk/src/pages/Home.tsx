import React from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = (menuType: string) => {
    // Programmatic navigation to nested routes
    navigate(`/menu/${menuType}`);
  };

  return (
    <div>
      <Header />
      <Menu onMenuClick={handleMenuClick} />
    </div>
  );
};

export default Home;

