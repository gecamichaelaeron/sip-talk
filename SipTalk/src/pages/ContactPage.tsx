import React, { useRef, useState } from 'react';
import Contact, { type ContactHandle } from '../components/Contact';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const ContactPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const contactRef = useRef<ContactHandle>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleContactSubmit = () => {
    setModalOpen(true);
  };

  const confirmSubmission = () => {
    setModalOpen(false);
    showToast('✓ Your message has been sent!');
    contactRef.current?.reset();
  };

  const cancelSubmission = () => {
    setModalOpen(false);
    showToast('✗ Submission cancelled.');
  };

  return (
    <div>
      <Contact ref={contactRef} onSubmit={handleContactSubmit} />
      <Modal
        isOpen={modalOpen}
        message="Do you want to send your message?"
        onConfirm={confirmSubmission}
        onCancel={cancelSubmission}
      />
      <Toast message={toastMessage} isVisible={toastVisible} />
    </div>
  );
};

export default ContactPage;

