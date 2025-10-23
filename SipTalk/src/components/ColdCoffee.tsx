import React from 'react';
import '../styles/ColdCoffee.css';

interface ColdCoffeeProps {
  onBack: () => void;
}

interface CoffeeItem {
  name: string;
  price: string;
}

const ColdCoffee: React.FC<ColdCoffeeProps> = ({ onBack }) => {
  const coffeeItems: CoffeeItem[] = [
    { name: 'Cold Brew', price: '₱100' },
    { name: 'Ice Latte', price: '₱100' },
    { name: 'Mocha Frappe', price: '₱100' },
    { name: 'Vanilla Ice Coffee', price: '₱100' }
  ];

  return (
    <div className="cold-coffee-container">
      <div className="cold-coffee-content">
        <h1>Cold Coffee</h1>
        <div className="menu-items">
          {coffeeItems.map((item, index) => (
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

export default ColdCoffee;

