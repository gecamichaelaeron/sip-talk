import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div id="toast" className={`toast ${isVisible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Toast;



