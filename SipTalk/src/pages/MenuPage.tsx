import React from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import ColdCoffee from '../components/ColdCoffee';
import HotCoffee from '../components/HotCoffee';
import Dessert from '../components/Dessert';
import Snacks from '../components/Snacks';
import Menu from '../components/Menu';

const MenuPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const handleBackToMenu = () => {
    // Programmatic navigation back to menu
    navigate('/menu');
  };

  const handleMenuClick = (menuType: string) => {
    // Dynamic routing - navigate to specific menu category
    navigate(`/menu/${menuType}`);
  };

  // Render specific menu category based on URL parameter (Dynamic Routing)
  if (category === 'cold-coffee') {
    return <ColdCoffee onBack={handleBackToMenu} />;
  }

  if (category === 'hot-coffee') {
    return <HotCoffee onBack={handleBackToMenu} />;
  }

  if (category === 'dessert') {
    return <Dessert onBack={handleBackToMenu} />;
  }

  if (category === 'snacks') {
    return <Snacks onBack={handleBackToMenu} />;
  }

  // Default menu view
  return (
    <div>
      <Menu onMenuClick={handleMenuClick} />
      <Outlet /> {/* For nested routes */}
    </div>
  );
};

export default MenuPage;

