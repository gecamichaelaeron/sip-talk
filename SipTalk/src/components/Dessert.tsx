import React from 'react';
import '../styles/Dessert.css';

interface DessertProps {
  onBack: () => void;
}

interface DessertItem {
  name: string;
  price: string;
}

const Dessert: React.FC<DessertProps> = ({ onBack }) => {
  const dessertItems: DessertItem[] = [
    { name: 'Cheesecake', price: '₱100' },
    { name: 'Chocolate Brownie', price: '₱100' },
    { name: 'Carrot Cake', price: '₱100' },
    { name: 'Apple Pie', price: '₱100' }
  ];

  return (
    <div className="dessert-container">
      <div className="dessert-content">
        <h1>Dessert</h1>
        <div className="menu-items">
          {dessertItems.map((item, index) => (
            <div key={index} className="menu-item">
              <span>{item.name}</span>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
        <button onClick={onBack} className="back-button">
          ← Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Dessert;

