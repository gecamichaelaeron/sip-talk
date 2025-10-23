import React from 'react';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div id="customAlert" className={`custom-alert ${isOpen ? 'show' : ''}`}>
      <h3>Confirm Submission</h3>
      <p id="alertMessage">{message}</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default Modal;



