import React from 'react';
import '../styles/Snacks.css';

interface SnacksProps {
  onBack: () => void;
}

interface SnackItem {
  name: string;
  price: string;
}

const Snacks: React.FC<SnacksProps> = ({ onBack }) => {
  const snackItems: SnackItem[] = [
    { name: 'Chocolate Chip Cookies', price: '₱100' },
    { name: 'Sandwiches', price: '₱100' },
    { name: 'Banana Bread', price: '₱100' },
    { name: 'Brownies', price: '₱100' }
  ];

  return (
    <div className="snacks-container">
      <div className="snacks-content">
        <h1>Snacks</h1>
        <div className="menu-items">
          {snackItems.map((item, index) => (
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

export default Snacks;

