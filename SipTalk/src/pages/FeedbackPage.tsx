import React, { useRef, useState } from 'react';
import Feedback, { type FeedbackHandle } from '../components/Feedback';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const FeedbackPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const feedbackRef = useRef<FeedbackHandle>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleFeedbackSubmit = () => {
    setModalOpen(true);
  };

  const confirmSubmission = () => {
    setModalOpen(false);
    showToast('✓ Thank you for your feedback!');
    feedbackRef.current?.reset();
  };

  const cancelSubmission = () => {
    setModalOpen(false);
    showToast('✗ Submission cancelled.');
  };

  return (
    <div>
      <Feedback ref={feedbackRef} onSubmit={handleFeedbackSubmit} />
      <Modal
        isOpen={modalOpen}
        message="Do you want to submit your feedback?"
        onConfirm={confirmSubmission}
        onCancel={cancelSubmission}
      />
      <Toast message={toastMessage} isVisible={toastVisible} />
    </div>
  );
};

export default FeedbackPage;

