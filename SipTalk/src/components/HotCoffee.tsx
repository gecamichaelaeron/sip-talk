import React from 'react';
import '../styles/HotCoffee.css';

interface HotCoffeeProps {
  onBack: () => void;
}

interface CoffeeItem {
  name: string;
  price: number;
}

interface Order {
  name: string;
  price: number;
}

const HotCoffee: React.FC<HotCoffeeProps> = ({ onBack }) => {
  const coffeeItems: CoffeeItem[] = [
    { name: 'Cappuccino', price: 100 },
    { name: 'Café Latte', price: 100 },
    { name: 'Velvet Coffee', price: 100 },
    { name: 'Flat White', price: 100 },
    { name: 'Cinnamon Coffee', price: 100 },
    { name: 'Espresso', price: 100 },
    { name: 'Vanilla Latte', price: 100 }
  ];

  const addToOrder = (item: string, price: number) => {
    try {
      const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({ name: item, price: price });
      localStorage.setItem('orders', JSON.stringify(orders));
      alert(`${item} added to your order!`);
    } catch (error) {
      console.error('Error adding item to order:', error);
      alert('Failed to add item to order. Please try again.');
    }
  };

  return (
    <div className="hot-coffee-container">
      <div className="hot-coffee-content">
        <h1>Hot Coffee</h1>
        <div className="menu-items">
          {coffeeItems.map((item, index) => (
            <div key={index} className="menu-item">
              <span>{item.name} - ₱{item.price}</span>
              <button 
                onClick={() => addToOrder(item.name, item.price)}
                className="add-button"
              >
                Add to Order
              </button>
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

export default HotCoffee;

